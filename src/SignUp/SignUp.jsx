import { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { DollarSign, Eye, EyeOff, Wallet, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
export default function BudgetSignup() {
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm({
    defaultValues: {
      nickname: "",
      fullname: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = (data) => console.log(data);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      {/* Floating Icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <DollarSign className="absolute top-20 left-10 text-accent/20 w-12 h-12 animate-pulse" />
        <Wallet className="absolute bottom-32 right-16 text-secondary/20 w-10 h-10 animate-pulse" />
        <TrendingUp className="absolute top-40 right-24 text-muted/20 w-8 h-8 animate-pulse" />
      </div>

      <Card className="w-full max-w-md bg-card text-card-foreground rounded-3xl shadow-2xl border-0 overflow-hidden relative z-10">
        <CardHeader className="bg-primary/20 p-8 text-center relative overflow-hidden">
          <div className="relative flex flex-col items-center gap-3">
            <div className="bg-primary/30 p-3 rounded-2xl">
              <DollarSign className="w-10 h-10 text-primary-foreground" />
            </div>
            <CardTitle className="text-3xl font-bold text-primary">
              Start Budgeting Smart
            </CardTitle>
            <p className="text-foreground/80 text-sm">
              Take control of your finances today
            </p>
          </div>
        </CardHeader>

        <CardContent className="p-8 space-y-5">
          <Form {...form}>
            <div className="space-y-5">
              {/* Nickname */}
              <FormField
                control={form.control}
                name="nickname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground font-medium">
                      Nickname
                    </FormLabel>
                    <Input
                      {...field}
                      placeholder="How should we call you?"
                      className="bg-background border-border text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 rounded-xl h-11"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Full Name */}
              <FormField
                control={form.control}
                name="fullname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground font-medium">
                      Full Name
                    </FormLabel>
                    <Input
                      {...field}
                      placeholder="Your full legal name"
                      className="bg-background border-border text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 rounded-xl h-11"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground font-medium">
                      Email Address
                    </FormLabel>
                    <Input
                      {...field}
                      type="email"
                      placeholder="your.email@example.com"
                      className="bg-background border-border text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 rounded-xl h-11"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground font-medium">
                      Password
                    </FormLabel>
                    <div className="relative">
                      <Input
                        {...field}
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a strong password"
                        className="bg-background border-border text-foreground focus:ring-2 focus:ring-primary pr-12 transition-all duration-200 rounded-xl h-11"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1/2 -translate-y-1/2 text-foreground/70 hover:text-foreground h-9 w-9 p-0"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <Button
                onClick={form.handleSubmit(onSubmit)}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl h-12 mt-6 shadow-lg shadow-primary/30 transition-all duration-200 font-semibold"
              >
                Create Account
              </Button>

              {/* Sign In Link */}
              <div className="text-center pt-4">
                <p className="text-foreground/70 text-sm">
                  Already have an account?{" "}
                  <Link to="/">
                    <Button
                      variant="link"
                      className="text-secondary hover:text-secondary/80 font-semibold p-0 h-auto"
                    >
                      Sign In
                    </Button>
                  </Link>
                </p>
              </div>

              {/* Terms */}
              <p className="text-xs text-foreground/50 text-center pt-2">
                By signing up, you agree to our Terms of Service and Privacy
                Policy
              </p>
            </div>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
