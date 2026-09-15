"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Mode = "login" | "signup";

export default function LoginPage() {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  // The server bounces you back here with a reason; say what it was.
  useEffect(() => {
    const reason = new URLSearchParams(window.location.search).get("error");
    if (reason === "not_allowed")
      setError(
        "Signed in, but this email is not on the ALLOWED_EMAILS list for the site. " +
          "Remove that environment variable in Vercel, or add this address to it.",
      );
    else if (reason === "link_expired")
      setError("That sign-in link had already been used. Log in with your password instead.");
  }, []);

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
      // With email confirmation off, signUp returns a session straight away.
      // If the project still requires confirmation, signing in fails loudly
      // rather than leaving the button spinning.
      if (!data.session) {
        const retry = await supabase.auth.signInWithPassword({ email, password });
        if (retry.error) {
          setNotice("Account created, but it needs confirming before you can log in.");
          setBusy(false);
          return;
        }
      }
    }

    // A full load, not a client-side push — guarantees the new auth cookie
    // is sent with the request that renders the app.
    window.location.replace("/");
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
