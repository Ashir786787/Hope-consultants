import Link from "next/link";
import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";

const buttonVariants = cva(
  "group/hope-button inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-full border border-transparent font-medium whitespace-nowrap transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] select-none outline-none disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&>svg]:transition-transform [&>svg]:duration-300 [&>svg]:ease-[cubic-bezier(0.22,1,0.36,1)] hover:[&>svg]:translate-x-0.5",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-[0_8px_24px_-10px_rgb(var(--hope-ember-rgb)/0.65)] hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-[0_14px_32px_-10px_rgb(var(--hope-ember-rgb)/0.75)]",
        primary:
          "bg-primary text-primary-foreground shadow-[0_8px_24px_-10px_rgb(var(--hope-ember-rgb)/0.65)] hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-[0_14px_32px_-10px_rgb(var(--hope-ember-rgb)/0.75)]",
        secondary:
          "bg-secondary text-secondary-foreground hover:-translate-y-0.5 hover:bg-secondary/90",
        outline:
          "border-[rgb(var(--hope-midnight-rgb)/0.18)] bg-hope-white text-hope-midnight hover:-translate-y-0.5 hover:border-[rgb(var(--hope-midnight-rgb)/0.4)] hover:bg-hope-midnight hover:text-hope-white",
        ghost: "bg-transparent text-hope-midnight hover:bg-[rgb(var(--hope-midnight-rgb)/0.06)]",
        link: "h-auto border-0 bg-transparent p-0 text-hope-ember underline-offset-4 hover:underline",
        destructive: "bg-destructive/10 text-destructive hover:bg-destructive/20",
      },
      size: {
        default: "h-10 px-6 text-sm",
        xs: "h-8 px-3 text-xs",
        sm: "h-9 px-4 text-xs",
        lg: "h-12 px-8 text-base",
        icon: "size-10",
        "icon-sm": "size-9",
        "icon-lg": "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

type ButtonProps = ButtonPrimitive.Props &
  VariantProps<typeof buttonVariants> & {
    href?: string;
  };

function Button({ className, variant = "default", size = "default", href, render, ...props }: ButtonProps) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
  nativeButton={!render && !href}
      render={render ?? (href ? <Link href={href} /> : undefined)}
      {...props}
    />
  );
}

export { Button, buttonVariants };