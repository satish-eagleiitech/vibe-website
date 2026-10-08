import { notFound } from "next/navigation";
import { BookPlaySlots } from "@/components/play/BookPlaySlots";
import { getPlayById } from "@/lib/api/play";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await getPlayById(id);
  return { title: item ? `Book · ${item.title}` : "Book a slot" };
}

export default async function BookPlayPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ date?: string }>;
}) {
  const [{ id }, { date }] = await Promise.all([params, searchParams]);
  const item = await getPlayById(id);
  if (!item) notFound();
  return <BookPlaySlots item={item} initialDate={date} />;
}
