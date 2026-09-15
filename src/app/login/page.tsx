"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Mode = "login" | "signup";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  function switchTo(next: Mode) {
    setMode(next);
    setError("");
    setNotice("");
    setConfirm("");
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setNotice("");

    if (mode === "signup" && password !== confirm) {
      setError("The two passwords don’t match.");
      return;
    }

    setBusy(true);
    const supabase = createClient();

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(
          error.message.toLowerCase().includes("invalid login credentials")
            ? "That email and password don’t match. No account yet? Tap Sign up."
            : error.message,
        );
        setBusy(false);
        return;
      }
    } else {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setError(
          error.message.toLowerCase().includes("already registered")
            ? "You already have an account with that email — tap Log in."
            : error.message,
        );
        setBusy(false);
        return;
      }
      if (!data.session) {
        setNotice("Account created. Check your email to confirm it, then log in.");
        setBusy(false);
        return;
      }
    }

    router.push("/");
    router.refresh();
  }

  const signup = mode === "signup";

  return (
    <div className="auth">
      <div className="authcard">
        <h1>
          Nutri<span>Track</span>
        </h1>
        <p>Your meal plan, your food log, and the road to 165 lb.</p>

        <div className="authtabs" role="tablist">
          <button
            type="button" role="tab" aria-selected={!signup}
            aria-current={!signup} onClick={() => switchTo("login")}
          >
            Log in
          </button>
          <button
            type="button" role="tab" aria-selected={signup}
            aria-current={signup} onClick={() => switchTo("signup")}
          >
            Sign up
          </button>
        </div>

        <form onSubmit={submit}>
          <input
            type="email" required autoComplete="email" placeholder="Email"
            value={email} onChange={(e) => setEmail(e.target.value)} aria-label="Email address"
          />
          <input
            type="password" required minLength={6}
            autoComplete={signup ? "new-password" : "current-password"}
            placeholder={signup ? "Choose a password (6+ characters)" : "Password"}
            value={password} onChange={(e) => setPassword(e.target.value)} aria-label="Password"
          />
          {signup && (
            <input
              type="password" required minLength={6} autoComplete="new-password"
              placeholder="Repeat that password"
              value={confirm} onChange={(e) => setConfirm(e.target.value)}
              aria-label="Repeat password"
            />
          )}
          <button className="save" type="submit" disabled={busy}>
            {busy ? "One moment…" : signup ? "Create my account" : "Log in"}
          </button>
        </form>

        {notice && <p className="authmsg">{notice}</p>}
        {error && <p className="authmsg bad">{error}</p>}

        <p className="authswap">
          {signup ? "Already set up?" : "First time here?"}{" "}
          <button type="button" onClick={() => switchTo(signup ? "login" : "signup")}>
            {signup ? "Log in instead" : "Create an account"}
          </button>
        </p>
      </div>
    </div>
  );
}
