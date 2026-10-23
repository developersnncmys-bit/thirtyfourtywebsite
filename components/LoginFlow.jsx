"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import Icon from "./Icon";
import BrandWaves from "./BrandWaves";
import { sendOtp, verifyOtp, otpLengthFrom, updateUser } from "@/lib/appApi";
import { signIn, updateSession, useSession } from "@/lib/session";

const RESEND_AFTER = 30;
const slide = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 },
  transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
};

// The app's login: phone → OTP → (new users) name & email
export default function LoginFlow() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/account";
  const session = useSession();
  const [step, setStep] = useState("phone");
  const [phone, setPhone] = useState("");
  const [len, setLen] = useState(6);
  const [otp, setOtp] = useState([]);
  const [wait, setWait] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const boxes = useRef([]);

  // Already logged in and not finishing a sign-up → go on
  useEffect(() => {
    if (session?.id && step === "phone") router.replace(next);
  }, [session?.id, step, next, router]);

  useEffect(() => {
    if (wait <= 0) return;
    const t = setTimeout(() => setWait((w) => w - 1), 1000);
    return () => clearTimeout(t);
  }, [wait]);

  const digits = phone.replace(/\D/g, "").slice(-10);

  const requestOtp = async (e) => {
    e?.preventDefault();
    setError("");
    if (!/^[6-9]\d{9}$/.test(digits)) return setError("Enter a valid 10-digit mobile number.");
    setBusy(true);
    try {
      const res = await sendOtp(digits);
      if (res.status === false) throw new Error(res.message || "Failed to send OTP. Please try again.");
      const n = otpLengthFrom(res);
      setLen(n);
      setOtp(Array(n).fill(""));
      setWait(RESEND_AFTER);
      setStep("otp");
      setTimeout(() => boxes.current[0]?.focus(), 350);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const verify = async (code) => {
    setError("");
    if (code.length !== len) return setError(`Enter the ${len}-digit code.`);
    setBusy(true);
    try {
      const res = await verifyOtp(digits, code);
      if (!res.status || !res.data) throw new Error(res.message || "Wrong OTP");
      const u = res.data;
      if (res.isNewUser || !u.userName) {
        setUser(u);
        setStep("profile");
      } else {
        signIn(u, digits);
        router.replace(next);
      }
    } catch (err) {
      setError(err.message || "Wrong OTP");
      setOtp(Array(len).fill(""));
      boxes.current[0]?.focus();
    } finally {
      setBusy(false);
    }
  };

  const setDigit = (i, v) => {
    const clean = v.replace(/\D/g, "");
    if (clean.length > 1) {
      // Pasted or autofilled the whole code
      const code = clean.slice(0, len).split("");
      const filled = Array(len)
        .fill("")
        .map((_, j) => code[j] || "");
      setOtp(filled);
      boxes.current[Math.min(code.length, len - 1)]?.focus();
      if (code.length === len) verify(code.join(""));
      return;
    }
    const nextOtp = [...otp];
    nextOtp[i] = clean;
    setOtp(nextOtp);
    if (clean && i < len - 1) boxes.current[i + 1]?.focus();
    if (nextOtp.every(Boolean)) verify(nextOtp.join(""));
  };

  const paste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setDigit(0, text);
    } catch {
      setError("Couldn't read the clipboard — type the code instead.");
    }
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    setError("");
    if (!name.trim()) return setError("Please enter your name.");
    if (email && !/^\S+@\S+\.\S+$/.test(email)) return setError("Enter a valid email or leave it empty.");
    setBusy(true);
    try {
      const id = String(user._id || user.id);
      await updateUser(id, { userName: name.trim(), email: email.trim() || undefined });
      signIn({ ...user, userName: name.trim(), email: email.trim() }, digits);
      updateSession({ userName: name.trim() });
      router.replace(next);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="login">
      <div className="login-waves">
        <BrandWaves />
      </div>
      <div className="login-card">
        <img src="/brand/logo.png" alt="3040 Property" className="login-logo" />
        <AnimatePresence mode="wait">
          {step === "phone" && (
            <motion.form key="phone" {...slide} onSubmit={requestOtp} noValidate>
              <h1>Welcome 👋</h1>
              <p className="muted">Login or sign up to continue. We&apos;ll send a One Time Password (OTP) to verify your number.</p>
              <label className="field">
                <span>Phone Number</span>
                <div className="field-prefix">
                  <em>+91</em>
                  <input value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="numeric" autoComplete="tel-national" placeholder="Enter your number" autoFocus maxLength={14} />
                </div>
              </label>
              {error && <p className="form-error">{error}</p>}
              <button className="btn btn-green btn-block" disabled={busy}>
                {busy ? "Sending OTP…" : "Continue"}
              </button>
              <p className="login-terms">
                By continuing you agree to our <Link href="/terms-and-conditions">Terms</Link> &amp; <Link href="/privacy-policy">Privacy Policy</Link>
              </p>
            </motion.form>
          )}

          {step === "otp" && (
            <motion.div key="otp" {...slide}>
              <button className="login-back" onClick={() => (setStep("phone"), setError(""))}>
                <Icon name="back" size={18} /> Change number
              </button>
              <h1>Verify your number</h1>
              <p className="muted">
                Enter the {len}-digit code sent to <b>+91 {digits}</b>
              </p>
              <div className="otp" onPaste={(e) => (e.preventDefault(), setDigit(0, e.clipboardData.getData("text")))}>
                {otp.map((d, i) => (
                  <input
                    key={i}
                    ref={(el) => (boxes.current[i] = el)}
                    value={d}
                    inputMode="numeric"
                    autoComplete={i === 0 ? "one-time-code" : "off"}
                    aria-label={`Digit ${i + 1}`}
                    onChange={(e) => setDigit(i, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Backspace" && !d && i > 0) boxes.current[i - 1]?.focus();
                    }}
                  />
                ))}
              </div>
              {error && <p className="form-error">{error}</p>}
              <div className="otp-tools">
                <button type="button" className="link-btn" onClick={paste}>
                  Paste code
                </button>
                {wait > 0 ? (
                  <span className="muted">Resend in {wait}s</span>
                ) : (
                  <button type="button" className="link-btn" onClick={requestOtp} disabled={busy}>
                    Resend OTP
                  </button>
                )}
              </div>
              <button className="btn btn-green btn-block" disabled={busy} onClick={() => verify(otp.join(""))}>
                {busy ? "Verifying…" : "Verify"}
              </button>
            </motion.div>
          )}

          {step === "profile" && (
            <motion.form key="profile" {...slide} onSubmit={saveProfile} noValidate>
              <h1>Tell us a bit about you</h1>
              <p className="muted">This is how owners will see you when you enquire.</p>
              <label className="field">
                <span>Name</span>
                <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" autoFocus />
              </label>
              <label className="field">
                <span>Email (optional)</span>
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" autoComplete="email" />
              </label>
              {error && <p className="form-error">{error}</p>}
              <button className="btn btn-green btn-block" disabled={busy}>
                {busy ? "Saving…" : "Continue"}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
