export const OTP_ENTRY_LENGTH = 6;

export type OtpSlots = string[];

export function emptySlots(): OtpSlots {
  return Array.from({ length: OTP_ENTRY_LENGTH }, () => "");
}

export function onlyDigits(input: string): string {
  return input.replace(/\D/g, "");
}

export function clampIndex(index: number): number {
  if (!Number.isFinite(index)) return 0;
  return Math.min(Math.max(Math.trunc(index), 0), OTP_ENTRY_LENGTH - 1);
}

export function isComplete(slots: OtpSlots): boolean {
  return slots.length === OTP_ENTRY_LENGTH && slots.every((slot) => slot !== "");
}

export function codeFromSlots(slots: OtpSlots): string {
  return isComplete(slots) ? slots.join("") : "";
}

export function typeInto(
  slots: OtpSlots,
  index: number,
  raw: string
): { slots: OtpSlots; focusIndex: number } {
  const typed = onlyDigits(raw);
  const next = [...slots];

  if (typed.length === 0) {
    next[index] = "";
    return { slots: next, focusIndex: index };
  }

  let cursor = index;
  for (const character of typed) {
    if (cursor >= OTP_ENTRY_LENGTH) break;
    next[cursor] = character;
    cursor += 1;
  }

  return { slots: next, focusIndex: clampIndex(cursor) };
}

export function pasteCode(text: string): { slots: OtpSlots; focusIndex: number } {
  const digits = onlyDigits(text).slice(0, OTP_ENTRY_LENGTH).split("");
  const slots = emptySlots();
  digits.forEach((digit, index) => {
    slots[index] = digit;
  });
  return { slots, focusIndex: clampIndex(digits.length) };
}

export function backspace(
  slots: OtpSlots,
  index: number
): { slots: OtpSlots; focusIndex: number } {
  const next = [...slots];
  if (next[index]) {
    next[index] = "";
    return { slots: next, focusIndex: index };
  }
  if (index === 0) return { slots: next, focusIndex: 0 };
  next[index - 1] = "";
  return { slots: next, focusIndex: index - 1 };
}

export function removeAt(slots: OtpSlots, index: number): OtpSlots {
  const next = [...slots];
  next[index] = "";
  return next;
}
