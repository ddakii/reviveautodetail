"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/website/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";

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
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (res?.ok) {
      router.push("/dashboard");
    } else {
      setError("Invalid email or password.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0C] flex">
      {/* Left brand */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0D0D0F] border-r border-white/5 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=1200&q=80"
            alt="Revive Auto Detail"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-[#0D0D0F]/60" />
        </div>
        <div className="relative">
          <Logo variant="light" size="md" href="/" />
        </div>
        <div className="relative">
          <div className="h-px w-12 bg-[#C9A86A] mb-6" />
          <h2 className="text-3xl font-bold text-white leading-tight mb-4">
            Your complete<br />detailing management<br />
            <span className="text-[#C9A86A] font-['Playfair_Display'] italic font-normal">platform.</span>
          </h2>
          <p className="text-white/40 text-sm">
            Manage customers, vehicles, appointments, quotes, and invoices — all in one place.
          </p>
        </div>
      </div>

      {/* Right login */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="lg:hidden mb-8">
            <Logo variant="light" size="md" href="/" />
          </div>

          <h1 className="text-2xl font-bold text-white mb-2">Sign in</h1>
          <p className="text-white/40 text-sm mb-8">Access your Revive dashboard</p>

          <form onSubmit={submit} className="space-y-4">
            {error && (
              <div className="bg-red-900/30 border border-red-500/30 text-red-400 px-4 py-3 text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-white/40 uppercase tracking-wider mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full h-11 px-4 bg-white/5 border border-white/10 text-white placeholder:text-white/20 focus:outline-none focus:border-[#C9A86A] transition-colors text-sm"
                placeholder="admin@reviveautodetail.com"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-white/40 uppercase tracking-wider mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full h-11 px-4 pr-10 bg-white/5 border border-white/10 text-white placeholder:text-white/20 focus:outline-none focus:border-[#C9A86A] transition-colors text-sm"
                  placeholder="••••••••"
                  required
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-[#C9A86A] text-[#0B0B0C] font-semibold text-sm hover:bg-[#b8964f] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in...
                </>
              ) : "Sign In"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-white/20 text-xs text-center">
              Demo credentials: admin@revive.com / Revive2026!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
