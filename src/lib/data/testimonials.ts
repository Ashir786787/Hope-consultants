export interface Testimonial {
  id: string;
  name: string;
  destination: string;
  quote: string;
  outcome: string;
}

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    name: "Ahmed R.",
    destination: "Study in Europe",
    quote:
      "The team was honest with me about which universities were realistic for my grades. No one promised me scholarships that were never going to happen.",
    outcome: "Admitted to a public university in Europe",
  },
];