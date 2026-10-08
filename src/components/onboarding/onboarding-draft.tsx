"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";

import { toDraftAnswers, type DraftAnswers, type FieldValue } from "@/lib/onboarding/answers";
import type { OnboardingSectionKey } from "@/lib/onboarding/sections";

export type SaveState = "idle" | "saving" | "saved" | "error";

const AUTOSAVE_DELAY_MS = 1000;

interface SessionSnapshot {
  answers: DraftAnswers;
}

let sessionSnapshot: SessionSnapshot | null = null;

export function clearSessionSnapshot(): void {
  sessionSnapshot = null;
}

interface OnboardingDraftContextValue {
  answers: DraftAnswers;
  saveState: SaveState;
  section: OnboardingSectionKey;
  setField: (section: OnboardingSectionKey, field: string, value: FieldValue) => void;
  setFieldAndSave: (section: OnboardingSectionKey, field: string, value: FieldValue) => void;
  flush: () => Promise<void>;
}

const OnboardingDraftContext = createContext<OnboardingDraftContextValue | null>(null);

export function OnboardingDraftProvider({
  section,
  initialDraft,
  children,
}: {
  section: OnboardingSectionKey;
  initialDraft?: unknown;
  children: ReactNode;
}) {
  const [answers, setAnswers] = useState<DraftAnswers>(
    () => sessionSnapshot?.answers ?? toDraftAnswers(initialDraft)
  );
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dirty = useRef(false);
  const answersRef = useRef(answers);

  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  const persist = useCallback(
    (payload: DraftAnswers) => {
      return fetch("/api/onboarding/draft", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentSection: section, answers: payload }),
      })
        .then((response) => setSaveState(response.ok ? "saved" : "error"))
        .catch(() => setSaveState("error"));
    },
    [section]
  );

  const persistRef = useRef(persist);

  useEffect(() => {
    persistRef.current = persist;
  }, [persist]);

  const flush = useCallback(() => {
    const hadPending = timer.current !== null || dirty.current;
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
    dirty.current = false;
    if (!hadPending) return Promise.resolve();
    return persistRef.current(answersRef.current);
  }, []);

  const setField = useCallback(
    (sectionKey: OnboardingSectionKey, field: string, value: FieldValue) => {
      dirty.current = true;
      setSaveState("saving");
      setAnswers((current) => ({
        ...current,
        [sectionKey]: { ...current[sectionKey], [field]: value },
      }));
    },
    []
  );

  const setFieldAndSave = useCallback(
    (sectionKey: OnboardingSectionKey, field: string, value: FieldValue) => {
      const next: DraftAnswers = {
        ...answersRef.current,
        [sectionKey]: { ...answersRef.current[sectionKey], [field]: value },
      };
      answersRef.current = next;
      dirty.current = false;
      if (timer.current) clearTimeout(timer.current);
      setSaveState("saving");
      setAnswers(next);
      persist(next);
    },
    [persist]
  );

  useEffect(() => {
    if (!dirty.current) return;
    dirty.current = false;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      timer.current = null;
      persistRef.current(answers);
    }, AUTOSAVE_DELAY_MS);
  }, [answers]);

  useEffect(() => {
    sessionSnapshot = { answers };
  });

  useEffect(() => {
    return () => {
      if (timer.current !== null || dirty.current) {
        if (timer.current) clearTimeout(timer.current);
        timer.current = null;
        dirty.current = false;
        persistRef.current(answersRef.current);
      }
    };
  }, []);

  const value = useMemo(
    () => ({ answers, saveState, section, setField, setFieldAndSave, flush }),
    [answers, saveState, section, setField, setFieldAndSave, flush]
  );

  return <OnboardingDraftContext.Provider value={value}>{children}</OnboardingDraftContext.Provider>;
}

export function useOnboardingDraft(): OnboardingDraftContextValue {
  const context = useContext(OnboardingDraftContext);
  if (!context) {
    throw new Error("useOnboardingDraft must be used inside OnboardingDraftProvider");
  }
  return context;
}

export function useSectionValues<Section extends OnboardingSectionKey>(section: Section) {
  const { answers, setField, setFieldAndSave } = useOnboardingDraft();
  const values = answers[section];

  const setValue = useCallback(
    (field: string, value: string | boolean) => setField(section, field, value),
    [section, setField]
  );

  const saveValue = useCallback(
    (field: string, value: string | boolean) => setFieldAndSave(section, field, value),
    [section, setFieldAndSave]
  );

  const toggleValue = useCallback(
    (field: string, option: string) => {
      const current = answers[section][field];
      const list = Array.isArray(current) ? current : [];
      const next = list.includes(option)
        ? list.filter((entry) => entry !== option)
        : [...list, option];
      setField(section, field, next);
    },
    [answers, section, setField]
  );

  const text = useCallback(
    (field: string) => {
      const current = values[field];
      return typeof current === "string" ? current : "";
    },
    [values]
  );

  const list = useCallback(
    (field: string) => {
      const current = values[field];
      return Array.isArray(current) ? current : [];
    },
    [values]
  );

  const flag = useCallback(
    (field: string) => values[field] === true,
    [values]
  );

  return { text, list, flag, setValue, saveValue, toggleValue };
}
