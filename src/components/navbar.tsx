"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { MenuIcon, XIcon } from "lucide-react";
import { cn } from "cn";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { useLenis } from "@/components/motion/smooth-scroll";
import { EASE_OUT, Z } from "@/lib/motion";

gsap.registerPlugin(useGSAP);

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
  const logoRef = useRef<HTMLAnchorElement>(null);
  const { stop, start } = useLenis();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) stop();
    else start();
  }, [menuOpen, stop, start]);

  useGSAP(
    () => {
      const el = logoRef.current;
      if (!el) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.fromTo(
        el,
        { autoAlpha: 0, x: -12 },
        { autoAlpha: 1, x: 0, duration: 0.7, ease: EASE_OUT }
      );
    },
    { scope: logoRef }
  );

  return (
    <DialogPrimitive.Root
      modal
      open={menuOpen}
      onOpenChange={(open) => setMenuOpen(open)}
    >
      <header
        data-tone="dark"
        style={{ zIndex: Z.navbar }}
        className={cn(
          "sticky top-0 w-full bg-hope-midnight transition-shadow duration-300",
          scrolled && "shadow-[0_14px_32px_-20px_rgb(var(--hope-obsidian-rgb)/0.8)]"
        )}
      >
        <div className="mx-auto grid h-[68px] w-full max-w-7xl grid-cols-[auto_1fr_auto] items-center px-5 lg:h-20 lg:px-16">
          <Link
            href="/"
            aria-label="Hope Consultants home"
            className={cn(
              "navbar-logo inline-flex min-h-11 items-center lg:min-h-12",
              scrolled && "scale-[0.85]"
            )}
          >
            <span ref={logoRef} className="inline-flex items-center">
              <Logo
                variant="lockup"
                priority
                className="h-11 w-auto lg:h-[52px]"
              />
            </span>
          </Link>

          <nav
            aria-label="Primary"
            className="hidden justify-center gap-10 text-sm font-medium text-hope-white/80 lg:flex"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors duration-300 hover:text-hope-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center justify-end gap-2">
            <Button href="/contact" size="sm" className="hidden lg:inline-flex">
              Free consultation
            </Button>
            <DialogPrimitive.Trigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-hope-white lg:hidden"
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
          data-tone="dark"
          style={{ zIndex: Z.menu }}
          className="fixed inset-x-0 top-0 flex h-dvh flex-col overflow-hidden bg-hope-midnight data-open:animate-in data-open:fade-in data-open:slide-in-from-top data-closed:animate-out data-closed:fade-out data-closed:slide-out-to-top"
        >
          <div className="flex h-[68px] shrink-0 items-center justify-between border-b border-hope-white/10 px-5">
            <DialogPrimitive.Close render={<Link href="/" aria-label="Hope Consultants home" />}>
              <Logo variant="lockup" className="h-11 w-auto" />
            </DialogPrimitive.Close>
            <DialogPrimitive.Close
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-hope-white"
                  aria-label="Close menu"
                />
              }
            >
              <XIcon />
            </DialogPrimitive.Close>
          </div>

          <nav
            aria-label="Mobile"
            className="flex flex-1 flex-col overflow-y-auto px-5"
          >
            {MOBILE_LINKS.map((link) => (
              <DialogPrimitive.Close
                key={link.href}
                render={<Link href={link.href} />}
              >
                <span className="flex items-center justify-between border-b border-hope-white/10 py-4 font-display text-2xl font-semibold tracking-tight text-hope-white/90 transition-colors hover:text-hope-white">
                  {link.label}
                </span>
              </DialogPrimitive.Close>
            ))}
          </nav>

          <div className="shrink-0 border-t border-hope-white/10 p-4 sm:px-5">
            <DialogPrimitive.Close render={<Button href="/contact" size="lg" className="w-full" />}>
              Book a free consultation
            </DialogPrimitive.Close>
          </div>
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}