import { useRoutes } from "react-router-dom";
import { routes } from "./routes";
import { Suspense } from "react";

export default function AppRoutes() {
  const element = useRoutes(routes);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      {element}
    </Suspense>
  );
}