import { Suspense } from "react";
import { LoginView } from "@/components/auth/LoginView";

export const metadata = { title: "Login or signup" };

export default function LoginPage() {
  return (
    <Suspense>
      <LoginView />
    </Suspense>
  );
}
