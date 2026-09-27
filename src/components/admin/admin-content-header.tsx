import type { CollectionSchema } from "@/lib/content/schemas";

export function AdminContentHeader({ schema }: { schema: CollectionSchema }) {
  return (
    <header className="flex flex-col gap-4">
      <p className="text-xs font-bold tracking-[0.18em] text-hope-midnight uppercase">
        Content
      </p>
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-hope-midnight sm:text-4xl">
          Content editor
        </h1>
        <p className="max-w-2xl text-base leading-7 text-hope-fog">
          Edit everything the website reads — {schema.label.toLowerCase()}, copy,
          images and settings — and save it straight to your content store.
        </p>
      </div>
    </header>
  );
}
