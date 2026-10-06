import Link from "next/link";
import { Container } from "@/components/common/Container";

type PlaceholderPageProps = {
  title: string;
  description: string;
};

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <section className="py-16 md:py-24">
      <Container>
        <div className="mx-auto max-w-2xl rounded-3xl border border-border bg-surface px-6 py-12 text-center shadow-sm md:px-12">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-accent">
            Coming next
          </p>
          <h1 className="mt-3 text-[30px] font-extrabold tracking-tight text-text">
            {title}
          </h1>
          <p className="mt-3 text-base text-text-secondary">{description}</p>
          <Link
            href="/"
            className="mt-8 inline-flex rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
          >
            Back to home
          </Link>
        </div>
      </Container>
    </section>
  );
}
