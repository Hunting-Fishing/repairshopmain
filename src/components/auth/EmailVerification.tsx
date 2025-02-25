
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export function EmailVerification() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(true);
  const [isError, setIsError] = useState(false);

  useState(() => {
    const verifyEmail = async () => {
      if (!token) {
        setIsError(true);
        setIsVerifying(false);
        return;
      }

      try {
        const { data: userId, error: validationError } = await supabase
          .rpc('validate_auth_token', {
            token_text: token,
            token_type: 'email_verification'
          });

        if (validationError) throw validationError;

        // Update user's email verification status
        const { error: updateError } = await supabase.auth.updateUser({
          data: { email_confirmed_at: new Date().toISOString() }
        });

        if (updateError) throw updateError;

        toast.success("Email verified successfully");
        navigate("/auth");
      } catch (error: any) {
        console.error("Error verifying email:", error);
        setIsError(true);
        toast.error(error.message || "Failed to verify email");
      } finally {
        setIsVerifying(false);
      }
    };

    verifyEmail();
  }, [token, navigate]);

  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="flex flex-col items-center space-y-4">
              <LoadingSpinner size="lg" className="text-primary" />
              <p className="text-center text-sm text-gray-600">
                Verifying your email...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Verification Failed</CardTitle>
            <CardDescription>
              We couldn't verify your email address.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertDescription>
                The verification link is invalid or has expired. Please request a new verification email.
              </AlertDescription>
            </Alert>
            <Button
              className="w-full mt-4"
              onClick={() => navigate("/auth")}
            >
              Return to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}
