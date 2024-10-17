import { ChartsDemo } from '@/components/Landing/ChartsDemo'
import { FaqAccordion } from '@/components/Landing/FaqAccordion'
import Features from '@/components/Landing/Features'
import { Footer } from '@/components/Landing/Footer'
import { HeroSection } from '@/components/Landing/HeroSection'
import SplitTheBillDemo from '@/components/Landing/SplitTheBillDemo'

export function Landing() {
  return (
    <div className="relative">
      {/* <div className="absolute inset-0 bg-gradient-to-r from-blue-400/30 via-indigo-500/30 to-purple-600/30 dark:from-blue-400/20 dark:via-indigo-500/20 dark:to-purple-600/20 blur-3xl -z-10" /> */}

      <div className="absolute top-0 z-[-2] w-screen transform bg-white bg-[radial-gradient(60%_120%_at_50%_50%,hsla(0,0%,100%,0)_0,rgba(252,205,238,.5)_100%)]">
        <HeroSection />

        <div id="features">
          <Features />
        </div>

        <ChartsDemo />

        <SplitTheBillDemo />

        <FaqAccordion />

        <Footer />
      </div>
    </div>
  )
}
