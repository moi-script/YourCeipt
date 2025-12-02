import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, UploadCloud, Cpu, TrendingUp } from "lucide-react";

const steps = [
  {
    title: "Scan or Upload Receipts",
    description: "Easily capture your receipts by scanning or uploading images.",
    icon: <UploadCloud className="w-12 h-12 text-primary-foreground" />,
  },
  {
    title: "AI Categorizes Your Spending",
    description: "Our AI automatically sorts your expenses into categories for you.",
    icon: <Cpu className="w-12 h-12 text-secondary-foreground" />,
  },
  {
    title: "View Insights & Trends",
    description: "Instantly see insights, trends, and summaries of your spending.",
    icon: <TrendingUp className="w-12 h-12 text-accent-foreground" />,
  },
];

export default function Onboarding() {
  const [stepIndex, setStepIndex] = useState(0);

  const nextStep = () => setStepIndex((prev) => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setStepIndex((prev) => Math.max(prev - 1, 0));

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md bg-card text-card-foreground rounded-3xl shadow-2xl border-0 overflow-hidden relative z-10">
        <CardHeader className="bg-primary/20 p-8 text-center relative overflow-hidden">
          <div className="flex flex-col items-center gap-4">
            <div className="bg-primary/30 p-5 rounded-3xl">{steps[stepIndex].icon}</div>
            <CardTitle className="text-2xl font-bold text-primary">{steps[stepIndex].title}</CardTitle>
            <p className="text-foreground/80 text-center">{steps[stepIndex].description}</p>
          </div>
        </CardHeader>

        <CardContent className="p-8 space-y-6">
          {/* Step indicators */}
          <div className="flex justify-center gap-2">
            {steps.map((_, idx) => (
              <span
                key={idx}
                className={`w-3 h-3 rounded-full ${
                  idx === stepIndex ? "bg-primary" : "bg-foreground/30"
                } transition-all duration-300`}
              ></span>
            ))}
          </div>

          {/* Navigation buttons */}
          <div className="flex justify-between mt-4">
            <Button
              variant="ghost"
              onClick={prevStep}
              disabled={stepIndex === 0}
              className="flex items-center gap-2 text-foreground/70 hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4" /> Previous
            </Button>

            <Button
              onClick={stepIndex === steps.length - 1 ? () => alert("Onboarding Complete!") : nextStep}
              className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl"
            >
              {stepIndex === steps.length - 1 ? "Finish" : "Next"} <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
