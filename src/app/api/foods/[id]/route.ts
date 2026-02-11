import { NextResponse } from "next/server";
import { FOOD_ENTRIES_TABLE } from "@/lib/foodEntries";
import { getSupabaseServerClient } from "@/lib/supabaseServer";

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;

    const supabase = getSupabaseServerClient();
    const { error } = await supabase.from(FOOD_ENTRIES_TABLE).delete().eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unexpected error" }, { status: 500 });
  }
}
