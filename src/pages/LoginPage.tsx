import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthShell from "../components/common/AuthShell";
import { useAuth } from "../store/AuthContext";

export default function LoginPage() {
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid email or password. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleGoogle() {
    setSubmitting(true);
    setError(null);
    try {
      await loginWithGoogle();
      navigate(from, { replace: true });
    } catch (err) {
      console.error("Google login error:", err);
      setError("Could not sign in with Google. Check your connection or Firebase settings.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to continue building your perfect resume."
      footer={
        <>
          New here?{" "}
          <Link to="/register" className="font-semibold text-brand-600 hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <button
        type="button"
        onClick={handleGoogle}
        disabled={submitting}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm font-semibold text-ink-800 shadow-soft transition hover:border-ink-300 disabled:opacity-60"
      >
        <GoogleIcon className="h-4 w-4" /> Continue with Google
      </button>
      <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-widest text-ink-400">
        <span className="h-px flex-1 bg-ink-100" />
        or sign in with email
        <span className="h-px flex-1 bg-ink-100" />
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Email">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-xl border border-ink-200 px-3.5 py-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
            placeholder="you@email.com"
          />
        </Field>
        <Field label="Password">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full rounded-xl border border-ink-200 px-3.5 py-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
            placeholder="••••••••"
          />
        </Field>
        {error && <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white shadow-pop transition hover:bg-brand-700 disabled:opacity-60"
        >
          {submitting ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </AuthShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-ink-500">
        {label}
      </span>
      {children}
    </label>
  );
}

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.78-.07-1.53-.2-2.27H12v4.51h6.46c-.28 1.48-1.13 2.74-2.4 3.58v2.97h3.87c2.27-2.09 3.56-5.18 3.56-8.79z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.07 7.95-2.91l-3.87-2.97c-1.08.72-2.45 1.16-4.08 1.16-3.13 0-5.79-2.11-6.74-4.95H1.27v3.11C3.25 21.3 7.31 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.26 14.33A7.21 7.21 0 0 1 4.84 12c0-.81.14-1.6.42-2.33V6.56H1.27A11.99 11.99 0 0 0 0 12c0 1.94.46 3.78 1.27 5.44l3.99-3.11z"
      />
      <path
        fill="#EA4335"
        d="M12 4.77c1.77 0 3.36.61 4.61 1.79l3.43-3.43C17.95 1.18 15.24 0 12 0 7.31 0 3.25 2.7 1.27 6.56l3.99 3.11C6.21 6.88 8.87 4.77 12 4.77z"
      />
    </svg>
  );
}
