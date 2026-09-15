import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import NutriTrack from "@/components/NutriTrack";
import type { Profile } from "@/lib/profile";

export const dynamic = "force-dynamic";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const allowed = process.env.ALLOWED_EMAILS?.split(",").map((e) => e.trim().toLowerCase());
  if (allowed?.length && user.email && !allowed.includes(user.email.toLowerCase())) {
    await supabase.auth.signOut();
    redirect("/login?error=not_allowed");
  }

  const { data: profile } = await supabase
    .from("profiles").select("*").eq("user_id", user.id).maybeSingle();

  // First visit: ask the questions before showing a plan built on guesses.
  if (!profile) redirect("/setup");

  return (
    <NutriTrack
      canEstimate={!!process.env.ANTHROPIC_API_KEY}
      email={user.email ?? ""}
      profile={profile as Profile}
    />
  );
}
