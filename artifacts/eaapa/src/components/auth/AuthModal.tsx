import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import {
  X, Sprout, ArrowRight, Phone, CreditCard, Eye, EyeOff,
  ChevronLeft, CheckCircle, Loader2, AlertCircle, RefreshCw, User, Building2
} from "lucide-react";
import { clsx } from "clsx";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
const API = `${BASE}/api`;

type SignInMethod = "id" | "otp";
type OtpPhase = "phone" | "code";
type RegisterStep = 1 | 2;

const COUNTRIES = [
  "Kenya", "Uganda", "Tanzania", "Ethiopia", "Rwanda",
  "Burundi", "South Sudan", "Somalia", "Eritrea",
];

// ── Shared input ──────────────────────────────────────────
function Input({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-white/60 uppercase tracking-widest">{label}</label>
      <input
        {...props}
        className={clsx(
          "w-full bg-background/60 border rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/25 transition-colors",
          "focus:border-primary focus:ring-0 outline-none",
          "border-white/10",
          props.className
        )}
      />
    </div>
  );
}

// ── OTP boxes ─────────────────────────────────────────────
function OtpInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const refs = Array.from({ length: 6 }, () => useRef<HTMLInputElement>(null));

  function handleKey(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace") {
      const next = value.split("");
      if (next[i]) { next[i] = ""; onChange(next.join("")); }
      else if (i > 0) { refs[i - 1].current?.focus(); next[i - 1] = ""; onChange(next.join("")); }
    }
  }

  function handleChange(i: number, raw: string) {
    const digit = raw.replace(/\D/g, "").slice(-1);
    const next = value.padEnd(6, " ").split("");
    next[i] = digit;
    onChange(next.join("").trimEnd());
    if (digit && i < 5) refs[i + 1].current?.focus();
  }

  return (
    <div className="flex gap-2 justify-center">
      {Array.from({ length: 6 }, (_, i) => (
        <input
          key={i}
          ref={refs[i]}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] ?? ""}
          onChange={e => handleChange(i, e.target.value)}
          onKeyDown={e => handleKey(i, e)}
          className={clsx(
            "w-11 h-14 text-center text-xl font-bold rounded-xl border bg-background/60 text-white outline-none transition-all",
            value[i] ? "border-primary shadow-md shadow-primary/20" : "border-white/10 focus:border-primary/60"
          )}
        />
      ))}
    </div>
  );
}

// ── Error banner ─────────────────────────────────────────
function ErrorBanner({ msg }: { msg: string }) {
  return (
    <div className="flex items-start gap-2.5 bg-destructive/10 border border-destructive/20 rounded-xl px-4 py-3">
      <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
      <p className="text-sm text-destructive/90 leading-relaxed">{msg}</p>
    </div>
  );
}

// ── Sign In panel ─────────────────────────────────────────
function SignInPanel() {
  const { login } = useAuth();
  const [method, setMethod] = useState<SignInMethod>("id");
  const [otpPhase, setOtpPhase] = useState<OtpPhase>("phone");
  const [idValue, setIdValue] = useState("");
  const [phone, setPhone] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpPreview, setOtpPreview] = useState<string | null>(null);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (resendCountdown <= 0) return;
    const t = setTimeout(() => setResendCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCountdown]);

  async function loginById() {
    if (!idValue.trim()) return setError("Please enter your National ID or Business Registration number.");
    setLoading(true); setError("");
    try {
      const r = await fetch(`${API}/auth/login/id`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nationalId: idValue.trim() }),
      });
      const d = await r.json();
      if (!r.ok) return setError(d.error ?? "Sign in failed.");
      login(d.token, d.user);
    } catch { setError("Connection error. Please try again."); }
    finally { setLoading(false); }
  }

  async function sendOtp() {
    if (!phone.trim()) return setError("Please enter your phone number.");
    setLoading(true); setError("");
    try {
      const r = await fetch(`${API}/auth/otp/send`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phone.trim() }),
      });
      const d = await r.json();
      if (!r.ok) return setError(d.error ?? "Failed to send OTP.");
      setOtpPreview(d.preview ?? null);
      setOtpPhase("code");
      setResendCountdown(60);
    } catch { setError("Connection error. Please try again."); }
    finally { setLoading(false); }
  }

  async function verifyOtp() {
    if (otpCode.length < 6) return setError("Please enter the complete 6-digit code.");
    setLoading(true); setError("");
    try {
      const r = await fetch(`${API}/auth/otp/verify`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phone.trim(), code: otpCode }),
      });
      const d = await r.json();
      if (!r.ok) return setError(d.error ?? "Verification failed.");
      login(d.token, d.user);
    } catch { setError("Connection error. Please try again."); }
    finally { setLoading(false); }
  }

  return (
    <div className="space-y-5">
      {/* Method selector */}
      <div className="grid grid-cols-2 gap-2 p-1 bg-background/60 rounded-2xl border border-white/8">
        {(["id", "otp"] as const).map(m => (
          <button
            key={m}
            onClick={() => { setMethod(m); setError(""); setOtpPhase("phone"); setOtpCode(""); }}
            className={clsx(
              "flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-sm font-semibold transition-all",
              method === m
                ? "bg-primary text-white shadow-md shadow-primary/25"
                : "text-white/50 hover:text-white"
            )}
          >
            {m === "id" ? <CreditCard className="w-3.5 h-3.5" /> : <Phone className="w-3.5 h-3.5" />}
            {m === "id" ? "National ID" : "Phone OTP"}
          </button>
        ))}
      </div>

      {/* Error */}
      {error && <ErrorBanner msg={error} />}

      {/* National ID flow */}
      {method === "id" && (
        <motion.div key="id-flow" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <Input
            label="National ID / Business Registration Number"
            placeholder="e.g. 30045123 or BRS/2024/001"
            value={idValue}
            onChange={e => setIdValue(e.target.value)}
            onKeyDown={e => e.key === "Enter" && loginById()}
          />
          <p className="text-xs text-white/40 leading-relaxed">
            Enter the ID number linked to your EAAPA account. No password required.
          </p>
          <button
            onClick={loginById}
            disabled={loading || !idValue.trim()}
            className="w-full py-3.5 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><ArrowRight className="w-4 h-4" /> Sign In</>}
          </button>
        </motion.div>
      )}

      {/* Phone OTP flow */}
      {method === "otp" && (
        <motion.div key="otp-flow" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <AnimatePresence mode="wait">
            {otpPhase === "phone" ? (
              <motion.div key="phone" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                <Input
                  label="Phone Number"
                  placeholder="+254 7XX XXX XXX"
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && sendOtp()}
                />
                <button
                  onClick={sendOtp}
                  disabled={loading || !phone.trim()}
                  className="w-full py-3.5 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Phone className="w-4 h-4" /> Send OTP Code</>}
                </button>
              </motion.div>
            ) : (
              <motion.div key="code" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-5">
                <div className="text-center space-y-1">
                  <p className="text-sm text-white/70">Code sent to <span className="text-white font-semibold">{phone}</span></p>
                  {otpPreview && (
                    <div className="inline-flex items-center gap-1.5 bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-lg">
                      <span className="text-xs text-white/50">Demo code:</span>
                      <span className="text-sm font-mono font-bold text-primary">{otpPreview}</span>
                    </div>
                  )}
                </div>
                <OtpInput value={otpCode} onChange={setOtpCode} />
                <button
                  onClick={verifyOtp}
                  disabled={loading || otpCode.length < 6}
                  className="w-full py-3.5 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><CheckCircle className="w-4 h-4" /> Verify & Sign In</>}
                </button>
                <div className="flex items-center justify-between">
                  <button onClick={() => { setOtpPhase("phone"); setOtpCode(""); setError(""); }} className="text-xs text-white/40 hover:text-white flex items-center gap-1">
                    <ChevronLeft className="w-3 h-3" /> Change number
                  </button>
                  {resendCountdown > 0 ? (
                    <span className="text-xs text-white/30">Resend in {resendCountdown}s</span>
                  ) : (
                    <button onClick={sendOtp} className="text-xs text-primary hover:text-primary/80 flex items-center gap-1">
                      <RefreshCw className="w-3 h-3" /> Resend code
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}

// ── Register panel ────────────────────────────────────────
function RegisterPanel() {
  const { login } = useAuth();
  const [step, setStep] = useState<RegisterStep>(1);
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "",
    phone: "", nationalId: "", country: "Kenya",
    accountType: "individual" as "individual" | "business",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  function set(k: keyof typeof form, v: string) {
    setForm(f => ({ ...f, [k]: v }));
  }

  function validateStep1() {
    if (!form.firstName.trim()) return "First name is required.";
    if (!form.lastName.trim()) return "Last name is required.";
    if (!form.email.trim() || !form.email.includes("@")) return "A valid email address is required.";
    return null;
  }

  function next() {
    const err = validateStep1();
    if (err) return setError(err);
    setError("");
    setStep(2);
  }

  async function submit() {
    setLoading(true); setError("");
    try {
      const r = await fetch(`${API}/auth/register`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email.trim(),
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          phone: form.phone.trim() || null,
          nationalId: form.nationalId.trim() || null,
          country: form.country,
        }),
      });
      const d = await r.json();
      if (!r.ok) return setError(d.error ?? "Registration failed. Please try again.");
      setSuccess(true);
      setTimeout(() => login(d.token, d.user), 1200);
    } catch { setError("Connection error. Please try again."); }
    finally { setLoading(false); }
  }

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-10 gap-4 text-center"
      >
        <div className="w-16 h-16 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-display font-bold text-white">Welcome to EAAPA!</h3>
          <p className="text-sm text-white/50 mt-1">Your account has been created. Signing you in…</p>
        </div>
        <Loader2 className="w-5 h-5 text-primary animate-spin" />
      </motion.div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Step indicator */}
      <div className="flex items-center gap-3">
        {[1, 2].map(s => (
          <div key={s} className="flex items-center gap-2">
            <div className={clsx(
              "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all",
              step >= s ? "bg-primary text-white" : "bg-white/5 text-white/30"
            )}>
              {step > s ? <CheckCircle className="w-4 h-4" /> : s}
            </div>
            <span className={clsx("text-xs font-medium", step >= s ? "text-white/70" : "text-white/25")}>
              {s === 1 ? "Personal Details" : "Account Setup"}
            </span>
            {s < 2 && <div className="flex-1 h-px bg-white/10 w-8" />}
          </div>
        ))}
      </div>

      {error && <ErrorBanner msg={error} />}

      <AnimatePresence mode="wait">
        {step === 1 ? (
          <motion.div key="step1" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Input label="First Name" placeholder="Amara" value={form.firstName} onChange={e => set("firstName", e.target.value)} />
              <Input label="Last Name" placeholder="Nkosi" value={form.lastName} onChange={e => set("lastName", e.target.value)} />
            </div>
            <Input label="Email Address" type="email" placeholder="amara@farm.co.ke" value={form.email} onChange={e => set("email", e.target.value)} />

            {/* Account type */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-white/60 uppercase tracking-widest">Account Type</label>
              <div className="grid grid-cols-2 gap-2">
                {(["individual", "business"] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => set("accountType", t)}
                    className={clsx(
                      "flex items-center gap-2 p-3 rounded-xl border text-sm font-medium transition-all",
                      form.accountType === t
                        ? "bg-primary/10 border-primary/40 text-primary"
                        : "bg-background/40 border-white/8 text-white/50 hover:text-white hover:border-white/20"
                    )}
                  >
                    {t === "individual" ? <User className="w-4 h-4" /> : <Building2 className="w-4 h-4" />}
                    {t === "individual" ? "Individual" : "Business / Org"}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={next} className="w-full py-3.5 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
              Continue <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        ) : (
          <motion.div key="step2" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} className="space-y-3">
            <Input label="Phone Number (optional)" type="tel" placeholder="+254 7XX XXX XXX" value={form.phone} onChange={e => set("phone", e.target.value)} />
            <Input label="National ID / Business Reg. No. (optional)" placeholder="30045123" value={form.nationalId} onChange={e => set("nationalId", e.target.value)} />

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-white/60 uppercase tracking-widest">Country</label>
              <select
                value={form.country}
                onChange={e => set("country", e.target.value)}
                className="w-full bg-background/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-primary"
              >
                {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <p className="text-xs text-white/35 leading-relaxed">
              By joining, you agree to the EAAPA <span className="text-primary/70">Terms of Service</span> and <span className="text-primary/70">Privacy Policy</span>.
            </p>

            <div className="flex gap-2">
              <button onClick={() => { setStep(1); setError(""); }} className="px-5 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white/60 text-sm font-medium hover:bg-white/10 transition-colors flex items-center gap-1.5">
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <button
                onClick={submit}
                disabled={loading}
                className="flex-1 py-3.5 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><CheckCircle className="w-4 h-4" /> Create Account</>}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Main modal ────────────────────────────────────────────
export function AuthModal() {
  const { authOpen, authTab, closeAuth, openAuth } = useAuth();

  // Lock body scroll while open
  useEffect(() => {
    if (authOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [authOpen]);

  // Close on Escape
  useEffect(() => {
    if (!authOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") closeAuth(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [authOpen, closeAuth]);

  return (
    <AnimatePresence>
      {authOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="auth-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[500] bg-black/70 backdrop-blur-md"
            onClick={closeAuth}
          />

          {/* Modal card */}
          <motion.div
            key="auth-modal"
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 8 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[501] flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="w-full max-w-md rounded-3xl overflow-hidden pointer-events-auto"
              style={{
                background: "hsl(220 28% 9%)",
                border: "1px solid hsl(220 22% 18%)",
                boxShadow: "0 32px 80px hsl(222 32% 4% / 0.8), inset 0 1px 0 hsl(220 30% 100% / 0.04)",
              }}
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="px-8 pt-8 pb-6 relative" style={{ borderBottom: "1px solid hsl(220 22% 14%)" }}>
                <button
                  onClick={closeAuth}
                  className="absolute top-6 right-6 w-8 h-8 rounded-xl flex items-center justify-center text-white/30 hover:text-white hover:bg-white/8 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: "hsl(152 55% 36% / 0.15)", border: "1px solid hsl(152 55% 36% / 0.25)" }}>
                    <Sprout className="w-5 h-5" style={{ color: "hsl(152 55% 46%)" }} />
                  </div>
                  <div>
                    <div className="font-display font-bold text-white">EAAPA<span style={{ color: "hsl(152 55% 46%)" }}>.</span></div>
                    <div className="text-[10px] font-mono uppercase tracking-widest" style={{ color: "hsl(215 18% 48%)" }}>Agricultural Alliance Platform</div>
                  </div>
                </div>

                {/* Tab switcher */}
                <div className="flex gap-0" style={{ borderBottom: "1px solid hsl(220 22% 16%)" }}>
                  {(["signin", "register"] as const).map(tab => (
                    <button
                      key={tab}
                      onClick={() => openAuth(tab)}
                      className={clsx(
                        "px-5 py-2.5 text-sm font-semibold transition-all relative",
                        authTab === tab ? "text-white" : "text-white/35 hover:text-white/60"
                      )}
                    >
                      {tab === "signin" ? "Sign In" : "Join EAAPA"}
                      {authTab === tab && (
                        <motion.div
                          layoutId="auth-tab-indicator"
                          className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                          style={{ background: "hsl(152 55% 36%)" }}
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Body */}
              <div className="px-8 py-7">
                <AnimatePresence mode="wait">
                  {authTab === "signin" ? (
                    <motion.div key="signin" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.16 }}>
                      <SignInPanel />
                    </motion.div>
                  ) : (
                    <motion.div key="register" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.16 }}>
                      <RegisterPanel />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer */}
              <div className="px-8 pb-7 text-center">
                <p className="text-xs" style={{ color: "hsl(215 18% 38%)" }}>
                  {authTab === "signin" ? (
                    <>Don't have an account?{" "}
                      <button onClick={() => openAuth("register")} className="font-semibold hover:underline" style={{ color: "hsl(152 55% 46%)" }}>
                        Join EAAPA
                      </button>
                    </>
                  ) : (
                    <>Already have an account?{" "}
                      <button onClick={() => openAuth("signin")} className="font-semibold hover:underline" style={{ color: "hsl(152 55% 46%)" }}>
                        Sign In
                      </button>
                    </>
                  )}
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
