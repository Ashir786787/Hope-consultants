"use client";

import { useEffect, useRef } from "react";

import {
  backspace,
  clampIndex,
  OTP_ENTRY_LENGTH,
  pasteCode,
  removeAt,
  typeInto,
  type OtpSlots,
} from "@/lib/admin/otp-entry";

export function AdminOtpInput({
  slots,
  onChange,
  onComplete,
  invalid,
  describedBy,
}: {
  slots: OtpSlots;
  onChange: (next: OtpSlots) => void;
  onComplete: () => void;
  invalid?: boolean;
  describedBy?: string;
}) {
  const boxes = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    boxes.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (slots.length === OTP_ENTRY_LENGTH && slots.every((slot) => slot !== "")) {
      onComplete();
    }
  }, [slots, onComplete]);

  function focusBox(index: number) {
    const box = boxes.current[clampIndex(index)];
    box?.focus();
    box?.select();
  }

  function handleChange(index: number, raw: string) {
    const next = typeInto(slots, index, raw);
    onChange(next.slots);
    if (next.focusIndex !== index) focusBox(next.focusIndex);
  }

  function handleKeyDown(
    event: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) {
    const key = event.key;

    if (key === "Backspace") {
      event.preventDefault();
      const next = backspace(slots, index);
      onChange(next.slots);
      focusBox(next.focusIndex);
      return;
    }
    if (key === "Delete") {
      event.preventDefault();
      onChange(removeAt(slots, index));
      return;
    }
    if (key === "ArrowLeft") {
      event.preventDefault();
      focusBox(index - 1);
      return;
    }
    if (key === "ArrowRight") {
      event.preventDefault();
      focusBox(index + 1);
    }
  }

  function handlePaste(event: React.ClipboardEvent<HTMLInputElement>) {
    event.preventDefault();
    const next = pasteCode(event.clipboardData.getData("text") ?? "");
    onChange(next.slots);
    focusBox(next.focusIndex);
  }

  return (
    <div
      role="group"
      aria-label="6-digit verification code"
      aria-describedby={describedBy}
      className="grid grid-cols-6 gap-2"
    >
      {Array.from({ length: OTP_ENTRY_LENGTH }, (_, index) => (
        <input
          key={index}
          ref={(element) => {
            boxes.current[index] = element;
          }}
          type="text"
          inputMode="numeric"
          autoComplete={index === 0 ? "one-time-code" : "off"}
          maxLength={1}
          value={slots[index] ?? ""}
          onChange={(event) => handleChange(index, event.target.value)}
          onKeyDown={(event) => handleKeyDown(event, index)}
          onPaste={handlePaste}
          onFocus={(event) => event.currentTarget.select()}
          aria-label={`Digit ${index + 1} of ${OTP_ENTRY_LENGTH}`}
          aria-invalid={invalid ? true : undefined}
          className="h-14 w-full min-w-0 rounded-lg border border-transparent bg-[var(--admin-login-input)] text-center text-xl font-bold text-[var(--admin-login-heading)] outline-none transition-colors focus:border-[var(--admin-login-accent)] focus:ring-2 focus:ring-[var(--admin-login-accent)]"
        />
      ))}
    </div>
  );
}
