"use client";

import { Container } from "@/components/common/Container";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="py-20">
      <Container>
        <div className="mx-auto max-w-xl rounded-3xl border border-border bg-surface p-10 text-center">
          <h1 className="text-2xl font-extrabold text-text">
            Something went wrong
          </h1>
          <p className="mt-2 text-sm text-text-secondary">
            The page failed to load. Try again, or head back home.
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-6 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white"
          >
            Try again
          </button>
        </div>
      </Container>
    </section>
  );
}
