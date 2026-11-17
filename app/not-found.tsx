import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <section className="-mb-10 flex w-full flex-1 flex-col items-center justify-center bg-white px-4 pt-4 pb-10 text-center md:-mb-14 md:pb-14 dark:bg-[#0b0b0f]">
      <Link href="/" className="relative block w-full max-w-[1800px]" aria-label="Go to home">
        <Image
          src="/images/404/lost.gif"
          alt="Look like you are lost — go to home"
          width={1200}
          height={680}
          unoptimized
          priority
          className="mx-auto h-auto max-h-[min(92svh,820px)] w-full object-contain"
        />
      </Link>
    </section>
  );
}
