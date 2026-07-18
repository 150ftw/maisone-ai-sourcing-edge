import { createFileRoute, useNavigate, Link, redirect } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2, ShieldAlert, UserCircle2, ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { ThemeProvider } from "@/components/theme-provider";
import { Logo } from "@/components/maisone/Logo";

// Route is a SIBLING of /admin (dot notation = not nested inside admin layout)
// so this page is NOT protected by the admin beforeLoad guard
export const Route = createFileRoute("/admin/login")({
  // If already authenticated, redirect straight to admin
  beforeLoad: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      throw redirect({ to: "/admin" });
    }
  },
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: (search.redirect as string) ?? "/admin",
  }),
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const navigate = useNavigate();
  const { redirect } = Route.useSearch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Listen for auth state changes – if logged in, redirect
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        navigate({ to: redirect as any });
      }
    });
    return () => subscription.unsubscribe();
  }, [navigate, redirect]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      // onAuthStateChange will handle the redirect
    } catch (err: any) {
      setError(err.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider>
      <div className="relative min-h-screen noise overflow-x-hidden bg-[#07070a] text-white flex flex-col">
        <div className="absolute inset-0 hero-aura pointer-events-none opacity-40" />

        {/* Header */}
        <header className="relative z-10 mx-auto w-full max-w-7xl px-6 py-5 flex items-center justify-between border-b border-white/5 bg-[#07070a]/80 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <Link to="/"><Logo /></Link>
            <span className="text-[10px] tracking-[0.2em] bg-electric/15 text-electric px-2.5 py-0.5 rounded-full uppercase font-medium">
              Admin
            </span>
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-4" /> Back to site
          </Link>
        </header>

        {/* Login Card */}
        <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-md">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="glass-strong rounded-3xl p-8 border border-white/10 shadow-2xl"
            >
              {/* Icon + heading */}
              <div className="text-center mb-8">
                <div className="mx-auto size-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-5">
                  <UserCircle2 className="size-7 text-white/70" />
                </div>
                <h1 className="font-serif text-3xl mb-2 tracking-tight">Atelier Access</h1>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Sign in to manage inquiries, suppliers, and shipments.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">
                    Work Email
                  </label>
                  <input
                    id="admin-email"
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="info@maisone.com"
                    className="w-full rounded-xl bg-black/50 border border-white/10 hover:border-white/20 focus:border-white/40 focus:bg-black/70 transition-all px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-electric"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">
                    Password
                  </label>
                  <input
                    id="admin-password"
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl bg-black/50 border border-white/10 hover:border-white/20 focus:border-white/40 focus:bg-black/70 transition-all px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-electric"
                  />
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-xs text-red-400 flex items-center gap-2"
                  >
                    <ShieldAlert className="size-4 shrink-0" />
                    <span>{error}</span>
                  </motion.div>
                )}

                <button
                  id="admin-signin-btn"
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white text-black font-semibold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                >
                  {loading ? <Loader2 className="size-4 animate-spin" /> : "Sign In to Admin"}
                </button>
              </form>
            </motion.div>
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
}
