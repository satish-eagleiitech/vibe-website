import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex min-h-[calc(100svh-var(--vybe-header-h))] w-full flex-col items-center justify-center bg-white px-4 py-8 text-center">
      <div className="relative w-full max-w-[1800px]">
        <Image
          src="/images/404/lost.gif"
          alt="Lost character looking for the page"
          width={1200}
          height={680}
          unoptimized
          priority
          className="mx-auto h-auto max-h-[min(58svh,520px)] w-full object-contain"
        />
      </div>

      <Link
        href="/"
        className="mt-7 inline-flex rounded-full bg-accent px-8 py-3 text-[14px] font-extrabold text-white transition-transform hover:scale-[1.02]"
      >
        Go to Home
      </Link>
    </section>
  );
}
