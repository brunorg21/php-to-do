import { Header } from "@/components/header";
import { Outlet } from "react-router-dom";

export function AppLayout() {
  return (
    <div className="flex flex-col space-y-12  min-h-screen">
      <Header />
      <Outlet />
    </div>
  );
}
