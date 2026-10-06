import { notFound } from "next/navigation";
import { DiningSpotView } from "@/components/dining/DiningSpotView";
import { getDiningById } from "@/lib/api/dining";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const spot = await getDiningById(id);
  return { title: spot?.name ?? "Restaurant" };
}

export default async function DiningDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const spot = await getDiningById(id);
  if (!spot) notFound();
  return <DiningSpotView spot={spot} />;
}
