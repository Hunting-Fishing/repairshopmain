
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const resetSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ResetFormValues = z.infer<typeof resetSchema>;

export function RequestPasswordResetForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ResetFormValues) => {
    setIsLoading(true);
    try {
      // First check if user exists
      const { data: userData, error: userError } = await supabase
        .from("auth.users")
        .select("id")
        .eq("email", data.email)
        .single();

      if (userError || !userData) {
        // We don't want to reveal if the email exists or not
        setSubmitted(true);
        return;
      }

      // Generate token using our database function
      const { data: tokenData, error: tokenError } = await supabase
        .rpc("create_auth_token", {
          user_id: userData.id,
          token_type: "password_reset",
        });

      if (tokenError) throw tokenError;

      // Send email with token
      const response = await supabase.functions.invoke("send-auth-email", {
        body: {
          email: data.email,
          token: tokenData,
          type: "password_reset",
        },
      });

      if (!response.error) {
        setSubmitted(true);
        toast.success("Password reset email sent");
      } else {
        throw response.error;
      }
    } catch (error: any) {
      console.error("Error requesting password reset:", error);
      toast.error(error.message || "Failed to send reset email");
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <Alert>
        <AlertDescription>
          If an account exists with {form.getValues("email")}, you will receive a password reset email shortly.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Sending reset email..." : "Send Reset Email"}
        </Button>
      </form>
    </Form>
  );
}
