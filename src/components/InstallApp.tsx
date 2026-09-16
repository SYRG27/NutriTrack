"use client";

import { useEffect, useState } from "react";

type InstallEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

/**
 * Registers the service worker, and offers the install prompt when the browser
 * says the app qualifies. Dismissing it is remembered, so it asks once.
 */
export default function InstallApp() {
  const [deferred, setDeferred] = useState<InstallEvent | null>(null);
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }

    const onPrompt = (e: Event) => {
      e.preventDefault();
      if (localStorage.getItem("nutritrack.install-dismissed")) return;
      setDeferred(e as InstallEvent);
      setHidden(false);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  if (hidden || !deferred) return null;

  const dismiss = () => {
    try {
      localStorage.setItem("nutritrack.install-dismissed", "1");
    } catch {
      /* private browsing */
    }
    setHidden(true);
  };

  return (
    <div className="installbar" role="region" aria-label="Install NutriTrack">
      <span className="instxt">
        <b>Add NutriTrack to your home screen</b>
        <span>Opens full screen, no browser bar, works without signal.</span>
      </span>
      <button
        className="save"
        onClick={async () => {
          await deferred.prompt();
          await deferred.userChoice;
          setHidden(true);
        }}
      >
        Install
      </button>
      <button className="insno" onClick={dismiss} aria-label="Not now">
        ✕
      </button>
    </div>
  );
}
