import { Outlet } from "react-router-dom";

export function AuthLayout() {
  return (
    <div className="flex items-center justify-center min-h-screen ">
      <Outlet />
    </div>
  );
}
