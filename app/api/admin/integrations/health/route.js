import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/getSession";
import { requireRole } from "@/lib/roles";
import { getProviderHealthSnapshot } from "@/lib/integrations/providerHealth";
import { getRuntimeCacheSnapshot } from "@/lib/runtimeCache";
import {
  getSandboxPresets,
  getVercelSandboxConfig,
} from "@/lib/integrations/vercelSandbox";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const session = await getAuthSession();
  if (!requireRole(session, "admin")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const [providers, runtimeCache, sandbox] = await Promise.all([
      getProviderHealthSnapshot(),
      Promise.resolve(getRuntimeCacheSnapshot()),
      getVercelSandboxConfig(),
    ]);

    return NextResponse.json({
      checkedAt: new Date().toISOString(),
      providers,
      runtimeCache,
      sandbox,
      sandboxPresets: getSandboxPresets(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to load integrations health" },
      { status: 500 },
    );
  }
}
