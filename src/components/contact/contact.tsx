"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Please tell us your name."),
  email: z.string().trim().email("That email address does not look right."),
  subject: z.string().trim().min(3, "A short subject helps us route it."),
  message: z.string().trim().min(10, "Please add a little more detail."),
});

type ContactValues = z.infer<typeof contactSchema>;

export function ContactForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
  });

  async function onSubmit(values: ContactValues) {
    const subject = encodeURIComponent(`[Hope Consultants] ${values.subject}`);
    const body = encodeURIComponent(
      `Name: ${values.name}\nEmail: ${values.email}\n\n${values.message}`
    );
    window.location.assign(`mailto:hello@hopeconsultants.example?subject=${subject}&body=${body}`);
    await new Promise<void>((resolve) => setTimeout(resolve, 600));
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-6 border border-border bg-card p-6 sm:p-8"
      noValidate
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Your name</Label>
        <Input
          id="name"
          type="text"
          autoComplete="name"
          placeholder="e.g. Ayesha Khan"
          {...register("name")}
        />
        {errors.name && (
          <p className="text-sm text-destructive" role="alert">
            {errors.name.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Your email</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-sm text-destructive" role="alert">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="subject">Subject</Label>
        <Input
          id="subject"
          type="text"
          placeholder="e.g. Question about Germany applications"
          {...register("subject")}
        />
        {errors.subject && (
          <p className="text-sm text-destructive" role="alert">
            {errors.subject.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="message">Your message</Label>
        <Textarea
          id="message"
          rows={6}
          placeholder="Ask us anything. We will answer honestly, even if the answer is that we cannot help yet."
          {...register("message")}
        />
        {errors.message && (
          <p className="text-sm text-destructive" role="alert">
            {errors.message.message}
          </p>
        )}
      </div>

      {isSubmitSuccessful && (
        <p className="border border-border bg-muted/50 p-4 text-sm leading-7 text-card-foreground">
          Your email app opened with the message ready to send. Nothing was stored on any
          server — we only receive what you choose to send.
        </p>
      )}

      <Button type="submit" size="lg" disabled={isSubmitting} className="w-fit">
        Open my email to send
      </Button>
      <p className="text-xs leading-6 text-muted-foreground">
        We are a real consultancy, so your message is read by a person — usually within two
        working days. We never share your details, and we will never add you to a list
        without your clear permission.
      </p>
    </form>
  );
}

export function ContactInfo() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Badge variant="outline" className="w-fit border-border uppercase">
          Contact
        </Badge>
        <h2 className="font-display text-2xl font-semibold text-card-foreground">
          How to reach us honestly
        </h2>
      </div>
      <div className="flex flex-col gap-3 text-sm leading-7 text-muted-foreground">
        <p>
          We are based in Pakistan and work with students planning to study in Europe. We
          do not list a street address here because we do not run a walk-in office — you
          would turn up to an empty door.
        </p>
        <p>
          We do not publish a phone number we cannot answer reliably. The email form on
          this page is the fastest way to reach us.
        </p>
        <p>
          Expect our usual answer time of two working days, and please always be honest
          with us about your grades and budget — it is the only way our advice can be
          honest in return.
        </p>
      </div>
    </div>
  );
}
