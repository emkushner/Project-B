import type { MealType } from "./types";

export const mealTypes: MealType[] = ["Breakfast", "Lunch", "Dinner", "Snack"];

export const quickFoods = [
  {
    name: "Greek Yogurt",
    serving: "170 g cup",
    calories: 150,
    protein: 17,
    carbs: 9,
    fat: 4,
    meal: "Breakfast" as MealType
  },
  {
    name: "Grilled Chicken Bowl",
    serving: "1 bowl",
    calories: 520,
    protein: 42,
    carbs: 44,
    fat: 18,
    meal: "Lunch" as MealType
  },
  {
    name: "Salmon + Rice",
    serving: "1 plate",
    calories: 610,
    protein: 39,
    carbs: 52,
    fat: 24,
    meal: "Dinner" as MealType
  },
  {
    name: "Protein Bar",
    serving: "1 bar",
    calories: 210,
    protein: 20,
    carbs: 21,
    fat: 7,
    meal: "Snack" as MealType
  }
];
