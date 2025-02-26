
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface RateLimitedFormProps {
  onSubmit: (event: React.FormEvent) => void;
  children: React.ReactNode;
  maxAttempts?: number;
  warningThreshold?: number;
  windowDuration?: number;
}

export function RateLimitedForm({
  onSubmit,
  children,
  maxAttempts = 5,
  warningThreshold = 3,
  windowDuration = 60000, // 1 minute in milliseconds
}: RateLimitedFormProps) {
  const [attempts, setAttempts] = React.useState<number[]>([]);
  const [isBlocked, setIsBlocked] = React.useState(false);
  const [remainingTime, setRemainingTime] = React.useState(0);

  React.useEffect(() => {
    const now = Date.now();
    const recentAttempts = attempts.filter(
      (timestamp) => now - timestamp < windowDuration
    );
    setAttempts(recentAttempts);

    if (recentAttempts.length >= maxAttempts) {
      setIsBlocked(true);
      const newest = Math.max(...recentAttempts);
      setRemainingTime(Math.ceil((windowDuration - (now - newest)) / 1000));
    } else {
      setIsBlocked(false);
    }

    const interval = setInterval(() => {
      const now = Date.now();
      const recentAttempts = attempts.filter(
        (timestamp) => now - timestamp < windowDuration
      );
      setAttempts(recentAttempts);
      
      if (recentAttempts.length >= maxAttempts) {
        const newest = Math.max(...recentAttempts);
        setRemainingTime(Math.ceil((windowDuration - (now - newest)) / 1000));
      } else {
        setIsBlocked(false);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [attempts, maxAttempts, windowDuration]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const now = Date.now();
    const recentAttempts = [...attempts, now].filter(
      (timestamp) => now - timestamp < windowDuration
    );

    if (recentAttempts.length > maxAttempts) {
      toast.error(`Too many attempts. Please wait ${remainingTime} seconds.`);
      return;
    }

    if (recentAttempts.length >= warningThreshold) {
      toast.warning(`Warning: ${maxAttempts - recentAttempts.length} attempts remaining`);
    }

    setAttempts(recentAttempts);
    onSubmit(event);
  };

  if (isBlocked) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Too Many Attempts</AlertTitle>
        <AlertDescription>
          Please wait {remainingTime} seconds before trying again.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {children}
    </form>
  );
}
