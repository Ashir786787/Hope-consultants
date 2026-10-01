import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import type { ScholarshipProgram } from "@/lib/data/types";

type ScholarshipCardProps = {
  program: ScholarshipProgram;
};

export function ScholarshipCard({ program }: ScholarshipCardProps) {
  return (
    <article className="hope-card hope-card--light flex h-full flex-col gap-5 p-6">
      {program.image ? (
        <div className="relative -mx-6 -mt-6 aspect-16/9 shrink-0 overflow-hidden rounded-t-[1.5rem]">
          <Image
            src={program.image}
            alt={program.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
          />
        </div>
      ) : null}
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="font-display text-xl font-semibold text-card-foreground">
            {program.name}
          </h2>
          {program.group === "fully-funded" ? (
            <Badge className="bg-hope-ember text-hope-midnight">Fully funded</Badge>
          ) : (
            <Badge variant="outline">Partially funded</Badge>
          )}
        </div>
        <Badge variant="outline" className="w-fit">
          {program.country}
        </Badge>
      </div>
      <div className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
        {program.level ? (
          <p>
            <span className="font-medium text-card-foreground">Level:</span> {program.level}
          </p>
        ) : null}
        <p>
          <span className="font-medium text-card-foreground">What it covers:</span>{" "}
          {program.benefits}
        </p>
        {program.eligibility ? (
          <p>
            <span className="font-medium text-card-foreground">Who can apply:</span>{" "}
            {program.eligibility}
          </p>
        ) : null}
        {program.deadline ? (
          <p>
            <span className="font-medium text-card-foreground">Deadline:</span> {program.deadline}
          </p>
        ) : null}
        {program.applyAt ? (
          <p>
            <span className="font-medium text-card-foreground">Apply at:</span> {program.applyAt}
          </p>
        ) : null}
      </div>
    </article>
  );
}

export function SpotlightCard({ program }: ScholarshipCardProps) {
  return (
    <article className="hope-card hope-card--light flex h-full flex-col gap-5 p-6">
      {program.image ? (
        <div className="relative -mx-6 -mt-6 aspect-16/9 shrink-0 overflow-hidden rounded-t-[1.5rem]">
          <Image
            src={program.image}
            alt={program.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
          />
        </div>
      ) : null}
      <div className="flex flex-col gap-2">
        <h3 className="font-display text-xl font-semibold text-card-foreground">{program.name}</h3>
        <p className="text-sm leading-6 text-muted-foreground">{program.benefits}</p>
      </div>
      <Separator />
      <div className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
        {program.level ? (
          <p>
            <span className="font-medium text-card-foreground">Level:</span> {program.level}
          </p>
        ) : null}
        {program.deadline ? (
          <p>
            <span className="font-medium text-card-foreground">Deadline:</span> {program.deadline}
          </p>
        ) : null}
        {program.applyAt ? (
          <p>
            <span className="font-medium text-card-foreground">Apply at:</span> {program.applyAt}
          </p>
        ) : null}
        {program.source ? (
          <p>
            <span className="font-medium text-card-foreground">Official source:</span>{" "}
            {program.source}
          </p>
        ) : null}
      </div>
      {program.universities && program.universities.length > 0 ? (
        <div className="flex flex-col gap-2">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Universities we commonly assist students to apply to
          </p>
          <ul className="flex flex-col gap-1.5 text-sm leading-6 text-muted-foreground">
            {program.universities.map((university) => (
              <li key={university} className="flex items-start gap-2">
                <span aria-hidden="true" className="mt-0.5 text-primary">
                  ✓
                </span>
                <span>{university}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </article>
  );
}
