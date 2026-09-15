"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const supabase = createClient();

    // Sign in if the account exists; create it on the first visit.
    let { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error?.message.toLowerCase().includes("invalid login credentials")) {
      const signUp = await supabase.auth.signUp({ email, password });
      if (!signUp.error && !signUp.data.session) {
        setError("Account created — check your email to confirm it, then sign in.");
        setBusy(false);
        return;
      }
      error = signUp.error;
    }

    if (error) {
      setError(error.message);
      setBusy(false);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <div className="auth">
      <div className="authcard">
        <h1>
          Nutri<span>Track</span>
        </h1>
        <p>Your meal plan, your food log, and the road to 165 lb.</p>
        <form onSubmit={submit}>
          <input
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-label="Email address"
          />
          <input
            type="password"
            required
            minLength={6}
            autoComplete="current-password"
            placeholder="Password (6+ characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-label="Password"
          />
          <button className="save" type="submit" disabled={busy}>
            {busy ? "One moment…" : "Sign in"}
          </button>
        </form>
        <p className="authmsg" style={{ color: "var(--muted)" }}>
          First time? Type the email and password you want and hit Sign in — it creates your
          account.
        </p>
        {error && <p className="authmsg bad">{error}</p>}
      </div>
    </div>
  );
}
