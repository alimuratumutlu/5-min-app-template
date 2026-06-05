import { useRouter } from "expo-router";
import { OnboardingLab } from "@/components/onboarding-lab";

export default function OnboardingRoute() {
  const router = useRouter();

  return <OnboardingLab onDone={() => router.replace("/")} />;
}
