import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Mail, Lock, ArrowLeft } from "lucide-react";

export default function ForgotPassword() {
  const form = useForm({
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data) => console.log("Password reset request for:", data.email);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md bg-card text-card-foreground rounded-3xl shadow-2xl border-0 overflow-hidden relative z-10">
        {/* Header */}
        <CardHeader className="bg-primary/20 p-8 text-center relative overflow-hidden">
          <div className="relative flex flex-col items-center gap-3">
            <div className="bg-primary/30 p-3 rounded-2xl">
              <Mail className="w-10 h-10 text-primary-foreground" />
            </div>
            <CardTitle className="text-3xl font-bold text-primary">Forgot Password</CardTitle>
            <p className="text-foreground/80 text-sm">Enter your email to reset your password</p>
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

              {/* Submit Button */}
              <Button
                onClick={form.handleSubmit(onSubmit)}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl h-12 mt-6 shadow-lg shadow-primary/30 transition-all duration-200 font-semibold"
              >
                Reset Password
              </Button>

              {/* Back to Login Link */}
              <div className="text-center pt-4">
                <Button
                  variant="link"
                  className="text-secondary hover:text-secondary/80 font-semibold p-0 h-auto inline-flex items-center gap-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Login
                </Button>
              </div>

              {/* Info */}
              <p className="text-xs text-foreground/50 text-center pt-2">
                You will receive an email with instructions to reset your password.
              </p>
            </div>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
