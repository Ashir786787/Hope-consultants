"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { MenuIcon, XIcon } from "lucide-react";
import { cn } from "cn";

import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { Z } from "@/lib/motion";

const NAV_LINKS = [
  { label: "Services", href: "/services" },
  { label: "Countries", href: "/countries" },
  { label: "Process", href: "/process" },
  { label: "Scholarships", href: "/scholarships" },
  { label: "Resources", href: "/resources" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
] as const;

const MOBILE_LINKS = [
  ...NAV_LINKS,
  { label: "Testimonials", href: "/testimonials" },
] as const;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <DialogPrimitive.Root
      modal
      open={menuOpen}
      onOpenChange={(open) => setMenuOpen(open)}
    >
      <header
        style={{ zIndex: Z.navbar }}
        className={cn(
          "sticky top-0 w-full border-b backdrop-blur-md transition-all duration-300",
          scrolled
            ? "border-border bg-hope-white/90 shadow-[0_10px_30px_-18px_rgb(var(--hope-midnight-rgb)/0.5)]"
            : "border-transparent bg-hope-white/80"
        )}
      >
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-6 px-4 sm:px-6">
          <Link href="/" className="flex shrink-0 items-center" aria-label="Hope Consultants home">
            <Logo variant="lockup" className="h-12" />
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-medium text-hope-midnight/80 lg:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-hope-ember"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button href="/contact" size="sm" className="hidden lg:inline-flex">
              Free consultation
            </Button>
            <DialogPrimitive.Trigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden"
                  aria-label="Open menu"
                />
              }
            >
              <MenuIcon />
            </DialogPrimitive.Trigger>
          </div>
        </div>
      </header>

      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-hope-obsidian/40 supports-backdrop-filter:backdrop-blur-sm data-open:animate-in data-open:fade-in data-closed:animate-out data-closed:fade-out" />
        <DialogPrimitive.Popup
          style={{ zIndex: Z.menu }}
          className="fixed inset-x-0 top-0 flex h-dvh flex-col overflow-hidden bg-hope-white data-open:animate-in data-open:fade-in data-open:slide-in-from-top data-closed:animate-out data-closed:fade-out data-closed:slide-out-to-top"
        >
          <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-4 sm:px-6">
<DialogPrimitive.Close render={<Link href="/" aria-label="Hope Consultants home" />}>
<Logo variant="lockup" className="h-12" />
              </DialogPrimitive.Close>
            <DialogPrimitive.Close
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Close menu"
                />
              }
            >
              <XIcon />
            </DialogPrimitive.Close>
          </div>

          <nav className="flex flex-1 flex-col overflow-y-auto px-4 sm:px-6">
            {MOBILE_LINKS.map((link) => (
              <DialogPrimitive.Close
                key={link.href}
                render={<Link href={link.href} />}
              >
                <span className="flex items-center justify-between border-b border-border py-4 font-display text-2xl font-semibold tracking-tight text-hope-midnight transition-colors hover:text-hope-ember">
                  {link.label}
                </span>
              </DialogPrimitive.Close>
            ))}
          </nav>

          <div className="shrink-0 border-t border-border p-4 sm:px-6">
            <DialogPrimitive.Close render={<Button href="/contact" size="lg" className="w-full" />}>
              Book a free consultation
            </DialogPrimitive.Close>
          </div>
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}