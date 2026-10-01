type SearchEmptyStateProps = {
  heading: string;
  body: string;
};

export function SearchEmptyState({ heading, body }: SearchEmptyStateProps) {
  return (
    <div className="hope-card hope-card--light flex w-full flex-col items-center gap-2 p-10 text-center">
      <p className="font-display text-xl font-semibold text-card-foreground">{heading}</p>
      <p className="max-w-md text-sm leading-6 text-muted-foreground">{body}</p>
    </div>
  );
}
