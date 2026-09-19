import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";

gsap.registerPlugin(CustomEase);

export const EASE_OUT: gsap.EaseFunction = CustomEase.create(
  "hope-ease-out",
  "M0,0 C0.22,1 0.36,1 1,1"
);

export const DURATIONS = {
  micro: 0.2,
  base: 0.6,
  reveal: 0.9,
  hero: 1.2,
} as const;

export const STAGGER = {
  base: 0.06,
  reveal: 0.1,
} as const;

export const Z = {
  content: 0,
  sticky: 20,
  navbar: 40,
  menu: 50,
  cursor: 60,
  preloader: 70,
  progress: 80,
} as const;

export const VIEWPORT = {
  trigger: "top 85%",
} as const;