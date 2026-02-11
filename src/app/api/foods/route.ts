import { NextResponse } from "next/server";
import {
  FOOD_ENTRIES_TABLE,
  mapRowToFoodEntry,
  parseNewFoodEntry,
  type FoodEntryRow
} from "@/lib/foodEntries";
import { getSupabaseServerClient } from "@/lib/supabaseServer";

export async function GET() {
  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from(FOOD_ENTRIES_TABLE)
      .select("id, name, meal, calories, protein, carbs, fat, serving, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const entries = (data as FoodEntryRow[]).map(mapRowToFoodEntry);
    return NextResponse.json({ entries });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unexpected error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const payload = parseNewFoodEntry(await request.json());
    if (!payload) {
      return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
    }

    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from(FOOD_ENTRIES_TABLE)
      .insert(payload)
      .select("id, name, meal, calories, protein, carbs, fat, serving, created_at")
      .single();

    if (error || !data) {
      return NextResponse.json({ error: error?.message ?? "Insert failed." }, { status: 500 });
    }

    return NextResponse.json({ entry: mapRowToFoodEntry(data as FoodEntryRow) }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unexpected error" }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const supabase = getSupabaseServerClient();
    const { error } = await supabase.from(FOOD_ENTRIES_TABLE).delete().gte("created_at", "1970-01-01T00:00:00Z");

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unexpected error" }, { status: 500 });
  }
}
