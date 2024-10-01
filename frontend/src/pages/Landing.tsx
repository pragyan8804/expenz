import { HeroSection } from "@/components/Landing/HeroSection";

export function Landing() {
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-400/30 via-indigo-500/30 to-purple-600/30 dark:from-blue-400/20 dark:via-indigo-500/20 dark:to-purple-600/20 blur-3xl -z-10" />
      <HeroSection />
    </div>
  );
}