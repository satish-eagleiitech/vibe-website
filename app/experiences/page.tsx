import { redirect } from "next/navigation";

/** Experiences is retired — Play is the category now. */
export default function ExperiencesRedirectPage() {
  redirect("/play");
}
