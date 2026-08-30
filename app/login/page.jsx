"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { getProviders, signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import ReCAPTCHA from "react-google-recaptcha";
import { TOURNAMENT_DATES } from "@/lib/tournamentConfig";
import {
  FaSignInAlt,
  FaGoogle,
  FaUserSecret,
  FaEnvelope,
  FaLock,
  FaUserPlus,
  FaUser,
  FaShieldAlt,
  FaTrophy,
  FaBolt,
  FaGlobe,
  FaTicketAlt,
  FaCheckCircle,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { defaultActiveRole } from "@/lib/roles";

// ─── Animated background (no footballs — geometric particles + scanning lines) ─

function ParticleField() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 20% 50%, rgba(34,197,94,0.08) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(59,130,246,0.06) 0%, transparent 50%), radial-gradient(ellipse at 50% 80%, rgba(168,85,247,0.05) 0%, transparent 50%)",
        }}
      />

      {/* Floating geometric shapes */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: `${8 + ((i * 8) % 85)}%`,
            top: `${5 + ((i * 13) % 90)}%`,
            width: `${4 + (i % 4) * 3}px`,
            height: `${4 + (i % 4) * 3}px`,
            borderRadius: i % 3 === 0 ? "50%" : i % 3 === 1 ? "2px" : "0",
            transform: i % 3 === 2 ? "rotate(45deg)" : "none",
            background:
              i % 2 === 0 ? "rgba(34,197,94,0.3)" : "rgba(255,255,255,0.1)",
          }}
          animate={{
            y: [0, -20 - i * 5, 0],
            x: [0, i % 2 === 0 ? 10 : -10, 0],
            opacity: [0.15, 0.5, 0.15],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 4 + i * 0.7,
            repeat: Infinity,
            delay: i * 0.3,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Horizontal scanning line */}
      <motion.div
        className="absolute left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(34,197,94,0.15), transparent)",
        }}
        animate={{ top: ["0%", "100%"] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />

      {/* Pulsing rings */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 rounded-full border border-green-500/5"
        animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.05, 0.15, 0.05] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-100 h-100 rounded-full border border-green-500/5"
        animate={{ scale: [1.2, 0.8, 1.2], opacity: [0.03, 0.1, 0.03] }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      {/* Retro "5S ARENA" background text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <motion.div
          className="font-black uppercase text-center leading-none"
          style={{
            fontSize: "clamp(8rem, 20vw, 18rem)",
            fontFamily: "Impact, Arial Black, sans-serif",
            color: "transparent",
            WebkitTextStroke: "2px rgba(34,197,94,0.06)",
            letterSpacing: "0.1em",
          }}
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [0.98, 1.02, 0.98],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        >
          5S
          <br />
          ARENA
        </motion.div>
      </div>
      {/* Additional retro tilted text layers */}
      <motion.div
        className="absolute top-[15%] left-[-5%] font-black uppercase pointer-events-none select-none"
        style={{
          fontSize: "6rem",
          fontFamily: "Impact, Arial Black, sans-serif",
          color: "transparent",
          WebkitTextStroke: "1px rgba(34,197,94,0.04)",
          transform: "rotate(-12deg)",
        }}
        animate={{ x: [0, 30, 0], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      >
        5S ARENA
      </motion.div>
      <motion.div
        className="absolute bottom-[10%] right-[-5%] font-black uppercase pointer-events-none select-none"
        style={{
          fontSize: "5rem",
          fontFamily: "Impact, Arial Black, sans-serif",
          color: "transparent",
          WebkitTextStroke: "1px rgba(34,197,94,0.03)",
          transform: "rotate(8deg)",
        }}
        animate={{ x: [0, -20, 0], opacity: [0.15, 0.35, 0.15] }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      >
        5S ARENA
      </motion.div>
    </div>
  );
}

// ─── Security Notice Modal ────────────────────────────────────────────────────

function SecurityNotice({ onAccept }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/90 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="relative w-full max-w-md bg-gray-900 border border-green-500/30 rounded-3xl p-8 shadow-[0_0_60px_rgba(34,197,94,0.2)] overflow-hidden"
        initial={{ scale: 0.9, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 30 }}
        transition={{ type: "spring", damping: 25, stiffness: 220 }}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-linear-to-r from-transparent via-green-500/50 to-transparent" />

        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-full bg-green-900/40 border border-green-500/40 flex items-center justify-center shrink-0">
            <FaShieldAlt className="text-green-400" size={20} />
          </div>
          <div>
            <h3 className="font-black text-white uppercase tracking-widest text-sm">
              Security Notice
            </h3>
            <p className="text-gray-500 text-xs">
              Please read before continuing
            </p>
          </div>
        </div>

        <ul className="space-y-3 mb-6">
          {[
            {
              icon: FaLock,
              text: "Your password is encrypted using bcrypt. We never store plain-text passwords.",
            },
            {
              icon: FaShieldAlt,
              text: "We use HTTPS, CSRF protection, and rate limiting on all auth endpoints.",
            },
            {
              icon: FaCheckCircle,
              text: "Your personal data is only used to manage your account and bookings — never sold.",
            },
            {
              icon: FaCheckCircle,
              text: "Use a strong, unique password. Never share your credentials with anyone.",
            },
            {
              icon: FaShieldAlt,
              text: "If you suspect suspicious activity, contact us immediately via WhatsApp.",
            },
          ].map(({ icon: Icon, text }, i) => (
            <motion.li
              key={i}
              className="flex items-start gap-3 text-xs text-gray-400"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <Icon className="text-green-500 shrink-0 mt-0.5" size={12} />
              {text}
            </motion.li>
          ))}
        </ul>

        <motion.button
          onClick={onAccept}
          className="w-full py-3.5 rounded-xl bg-green-600 hover:bg-green-500 text-white font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(22,163,74,0.4)]"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
        >
          <FaCheckCircle size={14} /> I Understand — Continue
        </motion.button>

        <p className="text-center text-gray-600 text-[10px] mt-3 uppercase tracking-widest">
          This notice will not appear again
        </p>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

function AuthPageInner() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const recaptchaRef = useRef(null);
  const recaptchaSiteKey =
    typeof process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY === "string"
      ? process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY.trim()
      : "";

  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [recaptchaToken, setRecaptchaToken] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleEnabled, setGoogleEnabled] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [showSecurityNotice, setShowSecurityNotice] = useState(false);
  const [pendingAction, setPendingAction] = useState(null); // stores fn to run after security ack
  const [recaptchaAvailable, setRecaptchaAvailable] = useState(
    Boolean(recaptchaSiteKey),
  );
  const [rememberMe, setRememberMe] = useState(true);

  useEffect(() => {
    if (status !== "authenticated" || !session?.user) {
      return;
    }

    const callbackUrl = searchParams.get("callbackUrl");
    const activeRole = defaultActiveRole(
      session.user.email,
      session.user.roles || [session.user.activeRole || session.user.role || "user"],
    );
    const fallbackPath =
      callbackUrl ||
      (activeRole === "admin"
        ? "/admin/dashboard"
        : activeRole === "manager"
          ? "/manager/dashboard"
          : "/");

    router.replace(fallbackPath);
  }, [router, searchParams, session, status]);

  useEffect(() => {
    const requestedMode = new URLSearchParams(window.location.search).get("mode");
    if (requestedMode !== "register" && requestedMode !== "login") {
      return undefined;
    }

    const frameId = window.requestAnimationFrame(() => {
      setMode(requestedMode);
      setError("");
    });

    return () => window.cancelAnimationFrame(frameId);
  }, []);

  useEffect(() => {
    const authError = new URLSearchParams(window.location.search).get("error");
    if (authError !== "google") {
      return undefined;
    }

    const frameId = window.requestAnimationFrame(() => {
      setError(
        "Google sign-in is unavailable right now. Use your email and password instead.",
      );
    });

    return () => window.cancelAnimationFrame(frameId);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadProviders() {
      try {
        const providers = await getProviders();
        if (!cancelled) {
          setGoogleEnabled(Boolean(providers?.google));
        }
      } catch (providerError) {
        console.warn("[5s Arena] Failed to load auth providers:", providerError);
        if (!cancelled) {
          setGoogleEnabled(false);
        }
      }
    }

    loadProviders();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!recaptchaSiteKey) {
      return;
    }
    // Detect if ReCAPTCHA script can load (ad-blockers block google.com/recaptcha)
    const timeout = setTimeout(() => {
      if (!window.grecaptcha) {
        setRecaptchaAvailable(false);
        console.warn(
          "[5s Arena] ReCAPTCHA blocked (ad-blocker?). Proceeding without it.",
        );
      }
    }, 3000);
    return () => clearTimeout(timeout);
  }, [recaptchaSiteKey]);

  const withSecurityCheck = (action) => {
    const alreadySeen =
      typeof window !== "undefined" && localStorage.getItem("5sa_security_ack");
    if (alreadySeen) {
      action();
    } else {
      setPendingAction(() => action);
      setShowSecurityNotice(true);
    }
  };

  const handleSecurityAccept = () => {
    if (typeof window !== "undefined")
      localStorage.setItem("5sa_security_ack", "1");
    setShowSecurityNotice(false);
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  };

  const doLogin = async () => {
    setError("");
    if (recaptchaAvailable && !recaptchaToken) {
      setError("Please complete the security check.");
      return;
    }
    setLoading(true);
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (result?.error) setError(result.error);
    else {
      if (typeof window !== "undefined") {
        localStorage.setItem("5sa_remember_me", rememberMe ? "1" : "0");
      }
      router.push("/role-select");
      router.refresh();
    }
  };

  const doRegister = async () => {
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (recaptchaAvailable && !recaptchaToken) {
      setError("Please complete the verification check.");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, recaptchaToken }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Something went wrong.");
      recaptchaRef.current?.reset();
      setRecaptchaToken("");
      setLoading(false);
      return;
    }
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (result?.error) setError(result.error);
    else {
      if (typeof window !== "undefined") {
        localStorage.setItem("5sa_remember_me", "1"); // new accounts default to stay logged in
      }
      router.push("/role-select");
      router.refresh();
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    withSecurityCheck(doLogin);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    withSecurityCheck(doRegister);
  };

  const handleProviderSignIn = async (provider) => {
    if (provider === "google") setGoogleLoading(true);
    await signIn(provider, { callbackUrl: "/role-select" });
  };

  const inputClass = (field) =>
    `block w-full px-4 py-3.5 bg-gray-800/40 border rounded-xl text-white text-sm focus:ring-2 focus:ring-green-500/40 focus:border-green-600/50 outline-none transition-all placeholder-gray-600 backdrop-blur-sm ${
      focusedField === field
        ? "border-green-600/50 bg-gray-800/60"
        : "border-gray-700/40"
    }`;

  if (status === "authenticated") {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 relative overflow-hidden bg-gray-950">
      <AnimatePresence>
        {showSecurityNotice && (
          <SecurityNotice onAccept={handleSecurityAccept} />
        )}
      </AnimatePresence>
      <ParticleField />

      <div className="w-full max-w-5xl relative z-10 flex flex-col items-center justify-center gap-12 lg:gap-16">
        {/* ── Auth card ── */}
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="bg-gray-900/70 backdrop-blur-2xl shadow-2xl rounded-3xl border border-gray-700/40 relative overflow-hidden">
            <div
              className="absolute top-0 right-0 w-40 h-40 pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle at 100% 0%, rgba(34,197,94,0.08) 0%, transparent 70%)",
              }}
            />

            {/* Tabs */}
            <div className="flex border-b border-gray-800/50">
              {[
                {
                  key: "login",
                  label: "Sign In",
                  icon: <FaSignInAlt size={12} />,
                },
                {
                  key: "register",
                  label: "Register",
                  icon: <FaUserPlus size={12} />,
                },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => {
                    setMode(tab.key);
                    setError("");
                  }}
                  className={`flex-1 py-4 text-sm font-bold uppercase tracking-widest transition-all relative cursor-pointer flex items-center justify-center gap-2 ${
                    mode === tab.key
                      ? "text-green-400"
                      : "text-gray-600 hover:text-gray-400"
                  }`}
                >
                  {tab.icon} {tab.label}
                  {mode === tab.key && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r from-green-500 to-emerald-400"
                      layoutId="authTab"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}
                </button>
              ))}
            </div>

            <div className="p-8">
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-5 p-3 bg-red-950/50 border border-red-800/50 rounded-xl text-red-400 text-sm"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Google */}
              {googleEnabled && (
                <>
                  <motion.button
                    onClick={() => handleProviderSignIn("google")}
                    disabled={googleLoading}
                    className="w-full flex items-center justify-center gap-3 py-3.5 bg-white text-gray-900 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-gray-100 transition-all shadow-lg disabled:opacity-50 mb-4"
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FaGoogle className="text-red-500 text-lg" />
                    Continue with Google
                  </motion.button>

                  {/* OR divider */}
                  <div className="relative mb-5">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-800" />
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-gray-900/70 px-3 text-gray-600 text-[10px] font-bold uppercase tracking-widest">
                        or
                      </span>
                    </div>
                  </div>
                </>
              )}

              {/* Email/Password form */}
              <AnimatePresence mode="wait">
                {mode === "login" ? (
                  <motion.form
                    key="login-form"
                    onSubmit={handleLogin}
                    className="space-y-3"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="relative">
                      <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 text-sm pointer-events-none" />
                      <input
                        type="email"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={() => setFocusedField("email")}
                        onBlur={() => setFocusedField(null)}
                        className={`${inputClass("email")} pl-10`}
                        required
                        autoComplete="email"
                      />
                    </div>
                    <div className="relative">
                      <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 text-sm pointer-events-none" />
                      <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onFocus={() => setFocusedField("password")}
                        onBlur={() => setFocusedField(null)}
                        className={`${inputClass("password")} pl-10`}
                        required
                        autoComplete="current-password"
                      />
                    </div>
                    {/* Stay logged in */}
                    <label className="flex items-center gap-2.5 cursor-pointer select-none group px-1">
                      <div className="relative shrink-0">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="sr-only"
                        />
                        <div
                          className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${rememberMe ? "bg-green-500 border-green-500" : "border-gray-600 bg-transparent group-hover:border-gray-400"}`}
                        >
                          {rememberMe && (
                            <svg
                              width="10"
                              height="8"
                              viewBox="0 0 10 8"
                              fill="none"
                            >
                              <path
                                d="M1 4L3.5 6.5L9 1"
                                stroke="white"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          )}
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-gray-400 group-hover:text-gray-300 transition-colors">
                        Stay logged in
                      </span>
                    </label>
                    {recaptchaAvailable ? (
                        <ReCAPTCHA
                          ref={recaptchaRef}
                          sitekey={recaptchaSiteKey}
                          onChange={(token) => setRecaptchaToken(token || "")}
                          onErrored={() => setRecaptchaAvailable(false)}
                          theme="dark"
                        size="normal"
                      />
                    ) : (
                      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-900/20 border border-amber-700/30 text-amber-400 text-xs">
                        <FaShieldAlt size={12} />
                        <span>
                          Security check unavailable right now. You can still
                          continue securely.
                        </span>
                      </div>
                    )}
                    <motion.button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 bg-green-600 hover:bg-green-500 text-white font-black uppercase tracking-widest text-sm rounded-xl transition-all shadow-[0_0_20px_rgba(22,163,74,0.35)] disabled:opacity-50 flex items-center justify-center gap-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <FaSignInAlt size={14} />
                      {loading ? "Signing in…" : "Sign In"}
                    </motion.button>
                    <Link href="/">
                      <div className="w-full flex items-center justify-center gap-2 py-2 text-xs text-gray-600 hover:text-gray-400 transition-colors cursor-pointer mt-1">
                        <FaUserSecret size={11} /> Browse as Guest
                      </div>
                    </Link>
                  </motion.form>
                ) : (
                  <motion.form
                    key="register-form"
                    onSubmit={handleRegister}
                    className="space-y-3"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="relative">
                      <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 text-sm pointer-events-none" />
                      <input
                        type="text"
                        placeholder="Full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onFocus={() => setFocusedField("name")}
                        onBlur={() => setFocusedField(null)}
                        className={`${inputClass("name")} pl-10`}
                        required
                        autoComplete="name"
                      />
                    </div>
                    <div className="relative">
                      <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 text-sm pointer-events-none" />
                      <input
                        type="email"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={() => setFocusedField("email")}
                        onBlur={() => setFocusedField(null)}
                        className={`${inputClass("email")} pl-10`}
                        required
                        autoComplete="email"
                      />
                    </div>
                    <div className="relative">
                      <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 text-sm pointer-events-none" />
                      <input
                        type="password"
                        placeholder="Password (min 6 chars)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onFocus={() => setFocusedField("password")}
                        onBlur={() => setFocusedField(null)}
                        className={`${inputClass("password")} pl-10`}
                        required
                        autoComplete="new-password"
                      />
                    </div>
                    <div className="relative">
                      <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 text-sm pointer-events-none" />
                      <input
                        type="password"
                        placeholder="Confirm password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        onFocus={() => setFocusedField("confirm")}
                        onBlur={() => setFocusedField(null)}
                        className={`${inputClass("confirm")} pl-10`}
                        required
                        autoComplete="new-password"
                      />
                    </div>
                    {recaptchaAvailable ? (
                        <ReCAPTCHA
                          ref={recaptchaRef}
                          sitekey={recaptchaSiteKey}
                          onChange={(token) => setRecaptchaToken(token || "")}
                          onErrored={() => setRecaptchaAvailable(false)}
                          theme="dark"
                        size="normal"
                      />
                    ) : (
                      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-900/20 border border-amber-700/30 text-amber-400 text-xs">
                        <FaShieldAlt size={12} />
                        <span>
                          Security check unavailable right now. You can still
                          continue securely.
                        </span>
                      </div>
                    )}
                    <motion.button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 bg-green-600 hover:bg-green-500 text-white font-black uppercase tracking-widest text-sm rounded-xl transition-all shadow-[0_0_20px_rgba(22,163,74,0.35)] disabled:opacity-50 flex items-center justify-center gap-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <FaUserPlus size={14} />
                      {loading ? "Creating account…" : "Create Account"}
                    </motion.button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={null}>
      <AuthPageInner />
    </Suspense>
  );
}
