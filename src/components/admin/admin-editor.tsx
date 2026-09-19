"use client";

import { useEffect, useReducer, useState } from "react";
import { useRouter } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const COLLECTIONS = [
  "services",
  "countries",
  "testimonials",
  "scholarships",
  "resources",
  "process",
  "site",
] as const;

type Collection = (typeof COLLECTIONS)[number];

type State = {
  loading: boolean;
  text: string;
  message: string | null;
  error: string | null;
};

type Action =
  | { type: "reset" }
  | { type: "loaded"; text: string }
  | { type: "failed"; error: string }
  | { type: "saving" }
  | { type: "saved"; message: string }
  | { type: "saveFailed"; error: string };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "reset":
      return { loading: true, text: "", message: null, error: null };
    case "loaded":
      return { ...state, loading: false, text: action.text, error: null };
    case "failed":
      return { ...state, loading: false, error: action.error };
    case "saving":
      return { ...state, loading: false, message: null, error: null };
    case "saved":
      return { ...state, message: action.message };
    case "saveFailed":
      return { ...state, error: action.error };
  }
}

export function AdminEditor() {
  const router = useRouter();
  const [collection, setCollection] = useState<Collection>("services");
  const [state, dispatch] = useReducer(reducer, {
    loading: true,
    text: "",
    message: null,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/data/${collection}`, { cache: "no-store" })
      .then((response) => response.json())
      .then((payload: { data?: unknown }) => {
        if (!cancelled) {
          dispatch({
            type: "loaded",
            text: JSON.stringify(payload.data ?? [], null, 2),
          });
        }
      })
      .catch(() => {
        if (!cancelled) {
          dispatch({ type: "failed", error: "Could not load this collection." });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [collection]);

  function pickCollection(name: Collection) {
    setCollection(name);
    dispatch({ type: "reset" });
  }

  async function handleSave() {
    dispatch({ type: "saving" });
    let data: unknown;
    try {
      data = JSON.parse(state.text);
    } catch {
      dispatch({
        type: "saveFailed",
        error: "This is not valid JSON — fix it before saving.",
      });
      return;
    }
    const response = await fetch(`/api/data/${collection}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data }),
    });
    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as { error?: string } | null;
      dispatch({ type: "saveFailed", error: payload?.error ?? "Could not save." });
      return;
    }
    dispatch({
      type: "saved",
      message: "Saved. Changes appear on the site after the next build or deploy.",
    });
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.refresh();
  }

  return (
    <main className="bg-hope-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <Badge variant="outline" className="w-fit">
              Admin
            </Badge>
            <h1 className="font-display text-2xl font-semibold text-card-foreground">
              Content editor
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" href="/">
              View site
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Sign out
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {COLLECTIONS.map((name) => (
            <Button
              key={name}
              variant={collection === name ? "default" : "outline"}
              size="sm"
              onClick={() => pickCollection(name)}
            >
              {name}
            </Button>
          ))}
        </div>

        <div className="hope-card hope-card--light flex flex-col gap-3 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Label htmlFor="content-editor">{collection} · JSON</Label>
            <div className="flex flex-wrap items-center gap-2">
              {state.message && (
                <p className="text-sm text-muted-foreground">{state.message}</p>
              )}
              {state.error && (
                <p className="text-sm text-destructive" role="alert">
                  {state.error}
                </p>
              )}
              <Button size="sm" onClick={handleSave} disabled={state.loading}>
                {state.loading ? "Loading…" : "Save"}
              </Button>
            </div>
          </div>
          <textarea
            id="content-editor"
            className="min-h-[32rem] w-full resize-y rounded-lg border border-border bg-hope-fog/10 p-3 font-mono text-xs leading-6 text-card-foreground outline-none focus-visible:border-ring"
            value={state.loading ? "Loading…" : state.text}
            onChange={(event) =>
              dispatch({ type: "loaded", text: event.target.value })
            }
            readOnly={state.loading}
            spellCheck={false}
          />
        </div>
      </div>
    </main>
  );
}