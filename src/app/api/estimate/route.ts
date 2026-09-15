import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const Estimate = z.object({
  name: z.string().describe("the food, tidied up"),
  emoji: z.string().describe("a single emoji for it"),
  unit: z.string().describe('the natural unit: piece, cup, plate, glass, serving, or g'),
  kcal: z.number().describe("calories in ONE unit (per 100 g when unit is g)"),
  protein: z.number().describe("grams of protein in ONE unit (per 100 g when unit is g)"),
});

export async function POST(request: NextRequest) {
  // Signed-in users only — this endpoint spends money.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "not signed in" }, { status: 401 });

  if (!process.env.ANTHROPIC_API_KEY)
    return NextResponse.json({ error: "estimates are not configured" }, { status: 503 });

  const { food } = (await request.json()) as { food?: string };
  const query = (food ?? "").trim().slice(0, 120);
  if (!query) return NextResponse.json({ error: "no food given" }, { status: 400 });

  try {
    const client = new Anthropic();
    const response = await client.messages.parse({
      model: "claude-opus-5",
      max_tokens: 1024,
      system:
        "You estimate the nutrition of Indian food. Assume South Indian / Telugu home cooking " +
        "unless the name says otherwise, and normal home portions.",
      messages: [{ role: "user", content: `Estimate one serving of: ${query}` }],
      output_config: { format: zodOutputFormat(Estimate) },
    });

    if (!response.parsed_output)
      return NextResponse.json({ error: "could not read the estimate" }, { status: 502 });

    return NextResponse.json(response.parsed_output);
  } catch (err) {
    const status = err instanceof Anthropic.RateLimitError ? 429 : 502;
    const message =
      status === 429 ? "too many estimates just now — try again shortly" : "estimate failed";
    return NextResponse.json({ error: message }, { status });
  }
}
