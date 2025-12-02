import { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Eye, EyeOff, Wallet, DollarSign, TrendingUp } from "lucide-react";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data) => console.log(data);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      {/* Floating Icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <DollarSign className="absolute top-16 left-12 text-accent/20 w-12 h-12 animate-pulse" />
        <Wallet className="absolute bottom-28 right-16 text-secondary/20 w-10 h-10 animate-pulse" />
        <TrendingUp className="absolute top-36 right-24 text-muted/20 w-8 h-8 animate-pulse" />
      </div>

      <Card className="w-full max-w-md bg-card text-card-foreground rounded-3xl shadow-2xl border-0 overflow-hidden relative z-10">
        {/* Header */}
        <CardHeader className="bg-primary/20 p-8 text-center relative overflow-hidden">
          <div className="relative flex flex-col items-center gap-3">
            <div className="bg-primary/30 p-3 rounded-2xl">
              <Wallet className="w-10 h-10 text-primary-foreground" />
            </div>
            <CardTitle className="text-3xl font-bold text-primary">Welcome Back</CardTitle>
            <p className="text-foreground/80 text-sm">Sign in to access your account</p>
          </div>
        </CardHeader>

        <CardContent className="p-8 space-y-5">
          <Form {...form}>
            <div className="space-y-5">
              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground font-medium">Email Address</FormLabel>
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
                    <FormLabel className="text-foreground font-medium">Password</FormLabel>
                    <div className="relative">
                      <Input
                        {...field}
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="bg-background border-border text-foreground focus:ring-2 focus:ring-primary pr-12 transition-all duration-200 rounded-xl h-11"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1/2 -translate-y-1/2 text-foreground/70 hover:text-foreground h-9 w-9 p-0"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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
                Sign In
              </Button>

              {/* Signup Link */}
              <div className="text-center pt-4">
                <p className="text-foreground/70 text-sm">
                  Don’t have an account?{" "}
                  <Button
                    variant="link"
                    className="text-secondary hover:text-secondary/80 font-semibold p-0 h-auto"
                  >
                    Sign Up
                  </Button>
                </p>
              </div>

              {/* Forgot Password */}
              <div className="text-center">
                <Button
                  variant="link"
                  className="text-muted hover:text-muted/80 text-sm font-medium p-0 h-auto"
                >
                  Forgot Password?
                </Button>
              </div>
            </div>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
