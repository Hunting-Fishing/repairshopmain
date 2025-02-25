
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Progress } from "./progress";
import { cn } from "@/lib/utils";

export function NavigationLoading() {
  const location = useLocation();
  const [isNavigating, setIsNavigating] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let timeoutId: number;
    
    const startNavigation = () => {
      setIsNavigating(true);
      setProgress(0);
      
      const incrementProgress = () => {
        setProgress(prev => {
          if (prev >= 90) return prev;
          const increment = Math.random() * 15;
          return Math.min(prev + increment, 90);
        });
      };
      
      timeoutId = window.setInterval(incrementProgress, 100);
    };

    const finishNavigation = () => {
      setProgress(100);
      window.clearInterval(timeoutId);
      
      const cleanup = () => {
        setIsNavigating(false);
        setProgress(0);
      };
      
      window.setTimeout(cleanup, 200);
    };

    startNavigation();
    return () => {
      window.clearInterval(timeoutId);
      finishNavigation();
    };
  }, [location.pathname]);

  if (!isNavigating) return null;

  return (
    <div
      className={cn(
        "fixed top-0 left-0 right-0 z-50 h-1",
        "transition-opacity duration-200",
        progress === 100 ? "opacity-0" : "opacity-100"
      )}
    >
      <Progress value={progress} className="h-1" />
    </div>
  );
}
