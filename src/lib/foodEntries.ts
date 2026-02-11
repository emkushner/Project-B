import type { FoodEntry, MealType } from "@/lib/types";

export const FOOD_ENTRIES_TABLE = "food_entries";

export type FoodEntryRow = {
  id: string;
  name: string;
  meal: MealType;
  calories: number | string;
  protein: number | string;
  carbs: number | string;
  fat: number | string;
  serving: string;
  created_at: string;
};

export type NewFoodEntry = Omit<FoodEntry, "id" | "createdAt">;

const mealTypes: MealType[] = ["Breakfast", "Lunch", "Dinner", "Snack"];

function toNumber(value: unknown): number {
  const num = Number(value);
  if (!Number.isFinite(num) || num < 0) {
    return 0;
  }
  return Math.round(num * 10) / 10;
}

export function isMealType(value: unknown): value is MealType {
  return typeof value === "string" && mealTypes.includes(value as MealType);
}

export function parseNewFoodEntry(input: unknown): NewFoodEntry | null {
  if (!input || typeof input !== "object") {
    return null;
  }

  const data = input as Record<string, unknown>;

  if (typeof data.name !== "string" || data.name.trim().length === 0) {
    return null;
  }

  if (!isMealType(data.meal)) {
    return null;
  }

  const serving = typeof data.serving === "string" && data.serving.trim().length > 0 ? data.serving.trim() : "1 serving";

  return {
    name: data.name.trim(),
    meal: data.meal,
    serving,
    calories: toNumber(data.calories),
    protein: toNumber(data.protein),
    carbs: toNumber(data.carbs),
    fat: toNumber(data.fat)
  };
}

export function mapRowToFoodEntry(row: FoodEntryRow): FoodEntry {
  return {
    id: row.id,
    name: row.name,
    meal: row.meal,
    serving: row.serving,
    calories: toNumber(row.calories),
    protein: toNumber(row.protein),
    carbs: toNumber(row.carbs),
    fat: toNumber(row.fat),
    createdAt: row.created_at
  };
}
