"use client";

import { useEffect } from "react";
import {
  trackRecentView,
  type RecentCategory,
} from "@/lib/recent/storage";

type RecordRecentViewProps = {
  id: string;
  title: string;
  href: string;
  imageUrl: string;
  meta?: string;
  category: RecentCategory;
};

/** Records a detail-page visit into recently viewed. */
export function RecordRecentView(props: RecordRecentViewProps) {
  useEffect(() => {
    trackRecentView(props);
    // Only track once per mount / id
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.id]);

  return null;
}
