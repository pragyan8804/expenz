import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function HeroSection() {
  return (
    <>
      {/* Hero */}
      <div className="relative overflow-hidden py-24 lg:py-32 flex items-center justify-center min-h-screen">
        {/* Gradients */}
        <div
          aria-hidden="true"
          className="absolute inset-0 flex justify-center items-center"
        >
          
        </div>
        {/* End Gradients */}
        <div className="relative z-10">
          <div className="container py-10 lg:py-16">
            <div className="max-w-2xl text-center mx-auto">
              {/* <p className="text-blue-600 dark:text-blue-400 font-semibold">Take control of your finances</p> */}
              {/* Title */}
              <div className="mt-5 max-w-2xl">
                <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-6xl bg-gradient-to-r from-blue-400 to-indigo-600 dark:from-blue-600 dark:to-indigo-400 text-transparent bg-clip-text">
                  Expenz: Your Smart Expense Tracker
                </h1>
              </div>
              {/* End Title */}
              <div className="mt-5 max-w-3xl">
                <p className="text-xl text-muted-foreground">
                  Effortlessly manage your expenses, set budgets, and gain insights into your spending habits with our intuitive and powerful expense tracking app.
                </p>
              </div>
              {/* Buttons */}
              <div className="mt-8 gap-3 flex justify-center">
                <Link to="/login">
                  <Button size={"lg"}>Get Started</Button>
                </Link>
                <Button size={"lg"} variant={"outline"}>
                  Learn More
                </Button>
              </div>
              {/* End Buttons */}
            </div>
          </div>
        </div>
      </div>
      {/* End Hero */}
    </>
  );
}