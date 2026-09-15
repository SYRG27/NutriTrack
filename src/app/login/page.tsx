"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    setState("sending");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      setError(error.message);
      setState("error");
    } else {
      setState("sent");
    }
  }

  return (
    <div className="auth">
      <div className="authcard">
        <h1>
          Nutri<span>Track</span>
        </h1>
        <p>Your meal plan, your food log, and the road to 165 lb. Sign in with your email — no password to remember.</p>
        <form onSubmit={signIn}>
          <input
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-label="Email address"
          />
          <button className="save" type="submit" disabled={state === "sending"}>
            {state === "sending" ? "Sending…" : "Email me a sign-in link"}
          </button>
        </form>
        {state === "sent" && (
          <p className="authmsg">Check {email} — the link signs you straight in.</p>
        )}
        {state === "error" && <p className="authmsg bad">{error}</p>}
      </div>
    </div>
  );
}
