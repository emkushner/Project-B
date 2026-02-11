"use client";

import { useEffect, useMemo, useState } from "react";
import { mealTypes, quickFoods } from "@/lib/foodData";
import type { FoodEntry, MealType, NutritionTotals } from "@/lib/types";
import type { NewFoodEntry } from "@/lib/foodEntries";

const emptyTotals: NutritionTotals = {
  calories: 0,
  protein: 0,
  carbs: 0,
  fat: 0
};

type FormState = {
  name: string;
  meal: MealType;
  serving: string;
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
};

const defaultForm: FormState = {
  name: "",
  meal: "Lunch",
  serving: "1 serving",
  calories: "",
  protein: "",
  carbs: "",
  fat: ""
};

function toNumber(value: string): number {
  const num = Number(value);
  if (!Number.isFinite(num) || num < 0) {
    return 0;
  }
  return Math.round(num * 10) / 10;
}

function dateLabel(input: string): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(input));
}

async function parseApiError(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as { error?: string };
    return body.error ?? `Request failed (${response.status})`;
  } catch {
    return `Request failed (${response.status})`;
  }
}

export default function FoodTracker() {
  const [entries, setEntries] = useState<FoodEntry[]>([]);
  const [form, setForm] = useState<FormState>(defaultForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadEntries() {
      setError(null);
      setIsLoading(true);

      try {
        const response = await fetch("/api/foods", { cache: "no-store" });
        if (!response.ok) {
          setError(await parseApiError(response));
          setEntries([]);
          return;
        }

        const body = (await response.json()) as { entries: FoodEntry[] };
        setEntries(Array.isArray(body.entries) ? body.entries : []);
      } catch {
        setError("Unable to connect to the server.");
      } finally {
        setIsLoading(false);
      }
    }

    void loadEntries();
  }, []);

  const totals = useMemo<NutritionTotals>(() => {
    return entries.reduce(
      (acc, item) => {
        acc.calories += item.calories;
        acc.protein += item.protein;
        acc.carbs += item.carbs;
        acc.fat += item.fat;
        return acc;
      },
      { ...emptyTotals }
    );
  }, [entries]);

  const grouped = useMemo(() => {
    return mealTypes.map((meal) => ({
      meal,
      items: entries.filter((entry) => entry.meal === meal)
    }));
  }, [entries]);

  function updateForm<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function addEntry(entry: NewFoodEntry) {
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/foods", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(entry)
      });

      if (!response.ok) {
        setError(await parseApiError(response));
        return;
      }

      const body = (await response.json()) as { entry: FoodEntry };
      if (body.entry) {
        setEntries((prev) => [body.entry, ...prev]);
      }
    } catch {
      setError("Unable to save food entry.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function removeEntry(id: string) {
    setError(null);

    try {
      const response = await fetch(`/api/foods/${id}`, { method: "DELETE" });
      if (!response.ok) {
        setError(await parseApiError(response));
        return;
      }

      setEntries((prev) => prev.filter((entry) => entry.id !== id));
    } catch {
      setError("Unable to remove this entry.");
    }
  }

  async function clearEntries() {
    setError(null);

    try {
      const response = await fetch("/api/foods", { method: "DELETE" });
      if (!response.ok) {
        setError(await parseApiError(response));
        return;
      }

      setEntries([]);
    } catch {
      setError("Unable to clear entries.");
    }
  }

  async function submitCustomFood(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = form.name.trim();
    if (!trimmedName) {
      return;
    }

    await addEntry({
      name: trimmedName,
      meal: form.meal,
      serving: form.serving.trim() || "1 serving",
      calories: toNumber(form.calories),
      protein: toNumber(form.protein),
      carbs: toNumber(form.carbs),
      fat: toNumber(form.fat)
    });

    setForm(defaultForm);
  }

  return (
    <main className="page">
      <section className="hero">
        <p className="eyebrow">Daily Nutrition</p>
        <h1>Food Tracker</h1>
        <p className="subtitle">Log meals fast, keep calories and macros visible all day.</p>
        {isLoading && <p className="muted">Loading entries...</p>}
        {error && <p className="error">{error}</p>}
      </section>

      <section className="grid stats">
        <article>
          <h2>Calories</h2>
          <p>{totals.calories.toFixed(0)}</p>
        </article>
        <article>
          <h2>Protein</h2>
          <p>{totals.protein.toFixed(1)} g</p>
        </article>
        <article>
          <h2>Carbs</h2>
          <p>{totals.carbs.toFixed(1)} g</p>
        </article>
        <article>
          <h2>Fat</h2>
          <p>{totals.fat.toFixed(1)} g</p>
        </article>
      </section>

      <section className="grid two-col">
        <article className="panel">
          <h2>Quick Add</h2>
          <p className="muted">Add common meals with one tap.</p>
          <div className="quick-list">
            {quickFoods.map((food) => (
              <button
                key={food.name}
                type="button"
                className="quick-item"
                disabled={isSubmitting}
                onClick={() => void addEntry(food)}
              >
                <span>
                  <strong>{food.name}</strong>
                  <small>
                    {food.meal} • {food.serving}
                  </small>
                </span>
                <b>{food.calories} cal</b>
              </button>
            ))}
          </div>
        </article>

        <article className="panel">
          <h2>Custom Food</h2>
          <p className="muted">Track any meal, snack, or ingredient.</p>
          <form className="form" onSubmit={submitCustomFood}>
            <label>
              Food Name
              <input
                required
                value={form.name}
                onChange={(e) => updateForm("name", e.target.value)}
                placeholder="Turkey sandwich"
              />
            </label>
            <label>
              Meal
              <select value={form.meal} onChange={(e) => updateForm("meal", e.target.value as MealType)}>
                {mealTypes.map((meal) => (
                  <option key={meal} value={meal}>
                    {meal}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Serving
              <input
                value={form.serving}
                onChange={(e) => updateForm("serving", e.target.value)}
                placeholder="1 bowl"
              />
            </label>
            <div className="form-grid">
              <label>
                Calories
                <input
                  inputMode="decimal"
                  value={form.calories}
                  onChange={(e) => updateForm("calories", e.target.value)}
                  placeholder="350"
                />
              </label>
              <label>
                Protein (g)
                <input
                  inputMode="decimal"
                  value={form.protein}
                  onChange={(e) => updateForm("protein", e.target.value)}
                  placeholder="28"
                />
              </label>
              <label>
                Carbs (g)
                <input
                  inputMode="decimal"
                  value={form.carbs}
                  onChange={(e) => updateForm("carbs", e.target.value)}
                  placeholder="32"
                />
              </label>
              <label>
                Fat (g)
                <input
                  inputMode="decimal"
                  value={form.fat}
                  onChange={(e) => updateForm("fat", e.target.value)}
                  placeholder="12"
                />
              </label>
            </div>
            <button className="primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Add Food"}
            </button>
          </form>
        </article>
      </section>

      <section className="panel entries">
        <div className="entries-head">
          <h2>Today&apos;s Entries</h2>
          <button type="button" className="ghost" onClick={() => void clearEntries()} disabled={!entries.length}>
            Clear Day
          </button>
        </div>

        {entries.length === 0 && !isLoading && <p className="empty">No foods logged yet.</p>}

        {grouped.map(({ meal, items }) => (
          <div key={meal} className="meal-group">
            <h3>
              {meal} <span>{items.length}</span>
            </h3>
            {items.length === 0 ? (
              <p className="muted">No entries.</p>
            ) : (
              <ul>
                {items.map((item) => (
                  <li key={item.id}>
                    <div>
                      <strong>{item.name}</strong>
                      <p>
                        {item.serving} • {dateLabel(item.createdAt)}
                      </p>
                    </div>
                    <div className="entry-nutrition">
                      <span>{item.calories} cal</span>
                      <span>P {item.protein}g</span>
                      <span>C {item.carbs}g</span>
                      <span>F {item.fat}g</span>
                    </div>
                    <button type="button" onClick={() => void removeEntry(item.id)}>
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </section>
    </main>
  );
}
