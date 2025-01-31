import { useRoutes } from "react-router-dom";
import { router } from "./routes";

export default function AppRoutes() {
  return useRoutes(router.routes);
}