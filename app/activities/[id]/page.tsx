import { notFound } from "next/navigation";
import { ActivityDetailView } from "@/components/activities/ActivityDetailView";
import { getActivities, getActivityById } from "@/lib/api/activities";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const activity = await getActivityById(id);
  return { title: activity?.title ?? "Activity" };
}

export default async function ActivityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const activity = await getActivityById(id);
  if (!activity) notFound();

  const { items } = await getActivities();
  const related = items.filter((item) => item.id !== activity.id).slice(0, 8);

  return <ActivityDetailView activity={activity} related={related} />;
}
