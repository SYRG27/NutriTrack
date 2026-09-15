import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Setup from "@/components/Setup";
import type { Profile } from "@/lib/profile";

export const dynamic = "force-dynamic";

export default async function SetupPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data } = await supabase
    .from("profiles").select("*").eq("user_id", user.id).maybeSingle();

  return <Setup initial={(data as Profile) ?? null} />;
}
