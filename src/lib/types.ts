export type MealType = "Breakfast" | "Lunch" | "Dinner" | "Snack";

export type FoodEntry = {
  id: string;
  name: string;
  meal: MealType;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  serving: string;
  createdAt: string;
};

export type NutritionTotals = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};
