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

import { toDraftAnswers, type DraftAnswers, type FieldValue } from "@/lib/forms/answers";
import type { FormDefinition } from "@/lib/forms/types";

export type SaveState = "idle" | "saving" | "saved" | "error";

const AUTOSAVE_DELAY_MS = 1000;

const sessionSnapshots = new Map<string, DraftAnswers>();

export function clearSessionSnapshot(formKey: string): void {
  sessionSnapshots.delete(formKey);
}

interface FormDraftContextValue {
  answers: DraftAnswers;
  saveState: SaveState;
  section: string;
  setField: (section: string, field: string, value: FieldValue) => void;
  setFieldAndSave: (section: string, field: string, value: FieldValue) => void;
  flush: () => Promise<void>;
}

const FormDraftContext = createContext<FormDraftContextValue | null>(null);

export function FormDraftProvider({
  definition,
  section,
  draftEndpoint,
  initialDraft,
  children,
}: {
  definition: FormDefinition;
  section: string;
  draftEndpoint: string;
  initialDraft?: unknown;
  children: ReactNode;
}) {
  const formKey = definition.key;
  const [answers, setAnswers] = useState<DraftAnswers>(
    () => sessionSnapshots.get(formKey) ?? toDraftAnswers(definition, initialDraft)
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
      return fetch(draftEndpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentSection: section, answers: payload }),
      })
        .then((response) => setSaveState(response.ok ? "saved" : "error"))
        .catch(() => setSaveState("error"));
    },
    [draftEndpoint, section]
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

  const setField = useCallback((sectionKey: string, field: string, value: FieldValue) => {
    dirty.current = true;
    setSaveState("saving");
    setAnswers((current) => ({
      ...current,
      [sectionKey]: { ...current[sectionKey], [field]: value },
    }));
  }, []);

  const setFieldAndSave = useCallback(
    (sectionKey: string, field: string, value: FieldValue) => {
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
    sessionSnapshots.set(formKey, answers);
  }, [formKey, answers]);

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

  return <FormDraftContext.Provider value={value}>{children}</FormDraftContext.Provider>;
}

export function useFormDraft(): FormDraftContextValue {
  const context = useContext(FormDraftContext);
  if (!context) {
    throw new Error("useFormDraft must be used inside FormDraftProvider");
  }
  return context;
}

export function useFormSectionValues(section: string) {
  const { answers, setField, setFieldAndSave } = useFormDraft();
  const values = useMemo(() => answers[section] ?? {}, [answers, section]);

  const setValue = useCallback(
    (field: string, value: FieldValue) => setField(section, field, value),
    [section, setField]
  );

  const saveValue = useCallback(
    (field: string, value: FieldValue) => setFieldAndSave(section, field, value),
    [section, setFieldAndSave]
  );

  const toggleValue = useCallback(
    (field: string, option: string) => {
      const current = answers[section]?.[field];
      const list = Array.isArray(current)
        ? current.filter((entry): entry is string => typeof entry === "string")
        : [];
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

  const flag = useCallback((field: string) => values[field] === true, [values]);

  return { values, text, list, flag, setValue, saveValue, toggleValue };
}
