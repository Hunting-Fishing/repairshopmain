
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";

export function NotFoundPage() {
  const navigate = useNavigate();
  const { isModernTheme } = useTheme();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className={`text-center max-w-md mx-auto p-8 rounded-lg ${
        isModernTheme 
          ? 'bg-white/80 backdrop-blur-sm shadow-lg border border-blue-100/50'
          : 'bg-background'
      }`}>
        <h1 className={`text-4xl font-bold mb-4 ${
          isModernTheme ? 'text-blue-900' : ''
        }`}>
          404 - Page Not Found
        </h1>
        <p className={`mb-8 ${
          isModernTheme ? 'text-blue-600' : 'text-muted-foreground'
        }`}>
          Sorry, the page you are looking for doesn't exist or has been moved.
        </p>
        <div className="space-x-4">
          <Button
            onClick={() => navigate(-1)}
            variant={isModernTheme ? "outline" : "secondary"}
            className={isModernTheme ? 'border-blue-200 text-blue-600 hover:bg-blue-50' : ''}
          >
            Go Back
          </Button>
          <Button
            onClick={() => navigate("/")}
            variant={isModernTheme ? "default" : "default"}
            className={isModernTheme ? 'bg-blue-600 hover:bg-blue-700' : ''}
          >
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
}
