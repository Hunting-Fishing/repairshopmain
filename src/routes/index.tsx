import { Suspense } from "react";
import { useRoutes } from "react-router-dom";
import { routes } from "./routes";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function AppRoutes() {
  const element = useRoutes(routes);

  return (
    <Suspense fallback={<LoadingSpinner />}>
      {element}
    </Suspense>
  );
}