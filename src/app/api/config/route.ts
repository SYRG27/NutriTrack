import { NextResponse } from "next/server";

/**
 * The exercise library is a static bundle committed to the repo, so it cannot
 * be built with the Supabase keys inlined. It asks for them here instead —
 * these are the same public values already shipped in the browser bundle of
 * the main app, and row-level security is what protects the data either way.
 */
export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json(
    {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
      supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
    },
    { headers: { "cache-control": "no-store" } },
  );
}
