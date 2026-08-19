"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.ok) {
      router.push("/dashboard");
    } else {
      setError("Invalid email or password.");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#090909", display: "flex" }}>
      {/* Left — brand panel */}
      <div style={{ display: "none", width: "50%", background: "#0D0D0B", borderRight: "1px solid rgba(255,255,255,0.06)", flexDirection: "column", justifyContent: "space-between", padding: 56, position: "relative", overflow: "hidden" }}
        className="auth-panel">
        <img src="https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=1200&q=80" alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.18 }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(9,9,9,0.2), rgba(9,9,9,0.8))" }} />

        {/* Logo */}
        <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: "var(--c-gold)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13, color: "#fff" }}>R</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", letterSpacing: "0.08em" }}>REVIVE</div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", letterSpacing: "0.2em" }}>AUTO DETAIL</div>
          </div>
        </div>

        {/* Tagline */}
        <div style={{ position: "relative" }}>
          <div style={{ width: 40, height: 2, background: "var(--c-gold)", marginBottom: 24, opacity: 0.7 }} />
          <h2 style={{ fontSize: "clamp(22px, 2.5vw, 32px)", fontWeight: 700, color: "#fff", lineHeight: 1.2, marginBottom: 16, letterSpacing: "-0.02em" }}>
            Your complete<br />detailing management<br />
            <span style={{ color: "var(--c-gold)", fontWeight: 400, fontStyle: "italic" }}>platform.</span>
          </h2>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", lineHeight: 1.7 }}>
            Manage customers, vehicles, appointments, quotes, and invoices — all in one place.
          </p>
        </div>
      </div>

      {/* Right — login form */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "32px 24px" }}>
        <div style={{ width: "100%", maxWidth: 380 }}>
          {/* Mobile logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 40 }} className="auth-mobile-logo">
            <div style={{ width: 28, height: 28, borderRadius: 7, background: "var(--c-gold)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 11, color: "#fff" }}>R</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#fff", letterSpacing: "0.08em" }}>REVIVE AUTO DETAIL</div>
          </div>

          <h1 style={{ fontSize: 26, fontWeight: 700, color: "#fff", marginBottom: 6, letterSpacing: "-0.02em" }}>Sign in</h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.35)", marginBottom: 32 }}>Access your Revive dashboard</p>

          <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {error && (
              <div style={{ background: "rgba(220,38,38,0.12)", border: "1px solid rgba(220,38,38,0.25)", borderRadius: "var(--r-md)", padding: "12px 14px", fontSize: 13, color: "#f87171" }}>
                {error}
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@reviveautodetail.com"
                required
                style={{ height: 44, padding: "0 14px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "var(--r-md)", color: "#fff", fontSize: 14, fontFamily: "inherit", outline: "none", transition: "border-color 0.15s" }}
                onFocus={e => (e.currentTarget.style.borderColor = "var(--c-gold)")}
                onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={{ width: "100%", height: 44, padding: "0 40px 0 14px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "var(--r-md)", color: "#fff", fontSize: 14, fontFamily: "inherit", outline: "none", transition: "border-color 0.15s" }}
                  onFocus={e => (e.currentTarget.style.borderColor = "var(--c-gold)")}
                  onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                />
                <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.3)", padding: 0, display: "flex", alignItems: "center" }}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} style={{ width: "100%", height: 46, background: loading ? "rgba(184,155,99,0.5)" : "var(--c-gold)", color: "#fff", border: "none", borderRadius: "var(--r-md)", fontWeight: 700, fontSize: 14, cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 4, transition: "background 0.15s" }}>
              {loading ? (
                <>
                  <span style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} />
                  Signing in…
                </>
              ) : (
                <>Sign In <ArrowRight size={15} /></>
              )}
            </button>
          </form>

          <div style={{ marginTop: 24, paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.07)", textAlign: "center" }}>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.2)" }}>
              Demo: admin@revive.com / Revive2026!
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 1024px) {
          .auth-panel { display: flex !important; }
          .auth-mobile-logo { display: none !important; }
        }
      `}</style>
    </div>
  );
}
