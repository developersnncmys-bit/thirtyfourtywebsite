import { Suspense } from "react";
import LoginFlow from "@/components/LoginFlow";

export const metadata = { title: "Login", robots: { index: false } };

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginFlow />
    </Suspense>
  );
}
