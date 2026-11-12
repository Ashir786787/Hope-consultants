import { PHONE_COUNTRIES, type PhoneCountry } from "@/lib/data/phone-countries";

const DEFAULT_PHONE_COUNTRY_ISO = "PK";
const MAX_TOTAL_DIGITS = 15;
const MAX_DIAL_CODE_LENGTH = 3;

const COUNTRIES_BY_ISO = new Map(PHONE_COUNTRIES.map((country) => [country.iso, country]));
const COUNTRIES_BY_DIAL_CODE = new Map<string, PhoneCountry[]>();
for (const country of PHONE_COUNTRIES) {
  const existing = COUNTRIES_BY_DIAL_CODE.get(country.dialCode);
  if (existing) {
    existing.push(country);
  } else {
    COUNTRIES_BY_DIAL_CODE.set(country.dialCode, [country]);
  }
}

export function phoneCountryByIso(iso: string): PhoneCountry | null {
  return COUNTRIES_BY_ISO.get(iso) ?? null;
}

function defaultPhoneCountry(): PhoneCountry {
  const country = COUNTRIES_BY_ISO.get(DEFAULT_PHONE_COUNTRY_ISO);
  if (!country) {
    throw new Error("The default phone country is missing from the country list.");
  }
  return country;
}

function nationalDigits(national: string): string {
  return national.replace(/\D/g, "").replace(/^0+/, "");
}

function matchDialCode(dialCode: string, national: string): PhoneCountry | null {
  const candidates = COUNTRIES_BY_DIAL_CODE.get(dialCode);
  if (!candidates) return null;
  const length = nationalDigits(national).length;
  return (
    candidates.find((country) => length >= country.minDigits && length <= country.maxDigits) ??
    candidates[0]
  );
}

export function splitPhoneValue(value: string): { country: PhoneCountry; national: string } {
  const trimmed = value.trim();
  if (trimmed.startsWith("+")) {
    const rest = trimmed.slice(1);
    const leadingDigits = /^\d+/.exec(rest)?.[0] ?? "";
    const longest = Math.min(MAX_DIAL_CODE_LENGTH, leadingDigits.length);
    for (let length = longest; length >= 1; length -= 1) {
      const country = matchDialCode(leadingDigits.slice(0, length), rest.slice(length));
      if (country) {
        return { country, national: rest.slice(length) };
      }
    }
  }
  return { country: defaultPhoneCountry(), national: trimmed };
}

export function composePhoneValue(country: PhoneCountry, national: string): string {
  return `+${country.dialCode} ${national}`;
}

export function phoneFieldError(value: string, label: string): string | null {
  const { country, national } = splitPhoneValue(value);
  const length = nationalDigits(national).length;
  const maxDigits = Math.min(country.maxDigits, MAX_TOTAL_DIGITS - country.dialCode.length);
  if (length < country.minDigits) {
    return `Enter a ${label} with at least ${country.minDigits} digits.`;
  }
  if (length > maxDigits) {
    return `Enter a ${label} with at most ${maxDigits} digits.`;
  }
  return null;
}
