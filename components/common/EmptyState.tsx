type EmptyStateProps = {
  title: string;
  description?: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="rounded-3xl border border-border bg-surface px-6 py-12 text-center">
      <p className="text-lg font-semibold text-text">{title}</p>
      {description ? (
        <p className="mt-2 text-sm text-text-secondary">{description}</p>
      ) : null}
    </div>
  );
}
