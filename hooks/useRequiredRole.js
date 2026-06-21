"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { canAssumeRole, normalizeRoles } from "@/lib/roles";

export default function useRequiredRole(requiredRole) {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [syncingRole, setSyncingRole] = useState(false);
  const attemptedRoleRef = useRef(null);

  const email = session?.user?.email;
  const roles = useMemo(
    () => normalizeRoles(email, session?.user?.roles || [session?.user?.role || "user"]),
    [email, session?.user?.role, session?.user?.roles],
  );
  const activeRole = session?.user?.activeRole || session?.user?.role || "user";
  const canUseRequiredRole = canAssumeRole(email, roles, requiredRole);

  useEffect(() => {
    if (status === "loading") {
      return;
    }

    if (status === "unauthenticated") {
      const loginUrl = new URL("/login", window.location.origin);
      if (pathname) {
        loginUrl.searchParams.set("callbackUrl", pathname);
      }
      router.replace(`${loginUrl.pathname}${loginUrl.search}`);
      return;
    }

    if (!session) {
      return;
    }

    if (activeRole === requiredRole) {
      attemptedRoleRef.current = null;
      setSyncingRole(false);
      return;
    }

    if (!canUseRequiredRole) {
      router.replace("/");
      return;
    }

    if (attemptedRoleRef.current === requiredRole) {
      return;
    }

    attemptedRoleRef.current = requiredRole;
    setSyncingRole(true);

    let cancelled = false;

    (async () => {
      try {
        await update({ activeRole: requiredRole });
        if (!cancelled) {
          router.refresh();
        }
      } catch {
        if (!cancelled) {
          const roleSelectUrl = new URL("/role-select", window.location.origin);
          if (pathname) {
            roleSelectUrl.searchParams.set("next", pathname);
          }
          router.replace(`${roleSelectUrl.pathname}${roleSelectUrl.search}`);
        }
      } finally {
        if (!cancelled) {
          setSyncingRole(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [
    activeRole,
    canUseRequiredRole,
    pathname,
    requiredRole,
    router,
    session,
    status,
    update,
  ]);

  return {
    session,
    status,
    activeRole,
    roles,
    roleReady: status === "authenticated" && activeRole === requiredRole,
    rolePending:
      status === "loading" ||
      syncingRole ||
      (status === "authenticated" && canUseRequiredRole && activeRole !== requiredRole),
  };
}
