import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export type WorkoutSet = {
  id: string;
  performed_on: string;
  exercise_slug: string;
  exercise_name: string;
  group_key: string | null;
  set_index: number;
  reps: number | null;
  weight: number | null;
  unit: string;
};

export const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

let clientPromise: Promise<SupabaseClient | null> | null = null;

/**
 * Same origin as the food log, so the session cookie is already here. The keys
 * come from the app at runtime rather than being baked into this bundle, which
 * is committed to the repo.
 */
export function supabase(): Promise<SupabaseClient | null> {
  if (clientPromise) return clientPromise;
  clientPromise = (async () => {
    try {
      const res = await fetch("/api/config", { credentials: "include" });
      if (!res.ok) return null;
      const { supabaseUrl, supabaseAnonKey } = await res.json();
      if (!supabaseUrl || !supabaseAnonKey) return null;
      return createClient(supabaseUrl, supabaseAnonKey, {
        auth: { persistSession: true, autoRefreshToken: true, storageKey: "sb-nutritrack-auth" },
      });
    } catch {
      return null;
    }
  })();
  return clientPromise;
}

/** Signed in? The library still works without it — you just cannot log sets. */
export async function currentUser() {
  const sb = await supabase();
  if (!sb) return null;
  const { data } = await sb.auth.getUser();
  return data.user ?? null;
}

export async function setsFor(slug: string) {
  const sb = await supabase();
  if (!sb) return { todays: [] as WorkoutSet[], last: [] as WorkoutSet[], lastDate: null as string | null };

  const { data } = await sb
    .from("workout_sets")
    .select("*")
    .eq("exercise_slug", slug)
    .order("performed_on", { ascending: false })
    .order("set_index", { ascending: true })
    .limit(60);

  const rows = (data ?? []) as WorkoutSet[];
  const t = today();
  const todays = rows.filter((r) => r.performed_on === t);
  const previous = rows.filter((r) => r.performed_on !== t);
  const lastDate = previous[0]?.performed_on ?? null;
  return { todays, last: previous.filter((r) => r.performed_on === lastDate), lastDate };
}

export async function addSet(row: Omit<WorkoutSet, "id" | "performed_on">) {
  const sb = await supabase();
  if (!sb) return null;
  const { data: u } = await sb.auth.getUser();
  if (!u.user) return null;
  const { data, error } = await sb
    .from("workout_sets")
    .insert({ ...row, performed_on: today(), user_id: u.user.id })
    .select()
    .single();
  return error ? null : (data as WorkoutSet);
}

export async function removeSet(id: string) {
  const sb = await supabase();
  if (!sb) return;
  await sb.from("workout_sets").delete().eq("id", id);
}

/** Their scale's unit, so sets are recorded in what they actually read. */
export async function preferredUnit(): Promise<"lb" | "kg"> {
  const sb = await supabase();
  if (!sb) return "lb";
  const { data } = await sb.from("profiles").select("units").maybeSingle();
  return (data?.units as "lb" | "kg") ?? "lb";
}

export const describe = (sets: WorkoutSet[]) => {
  if (!sets.length) return "";
  const allSame =
    sets.every((s) => s.reps === sets[0].reps && s.weight === sets[0].weight);
  const w = (s: WorkoutSet) => (s.weight ? ` @ ${s.weight}${s.unit}` : "");
  return allSame
    ? `${sets.length} × ${sets[0].reps ?? "—"}${w(sets[0])}`
    : sets.map((s) => `${s.reps ?? "—"}${w(s)}`).join(", ");
};
