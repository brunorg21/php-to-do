import { RouterProvider } from "react-router-dom";
import { routes } from "./routes";
import { ThemeProvider } from "./components/theme-provider";
import { AuthContextProvider } from "./context/auth-context";
import { Toaster } from "./components/ui/toaster";

export function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      <AuthContextProvider>
        <RouterProvider router={routes} />

        <Toaster />
      </AuthContextProvider>
    </ThemeProvider>
  );
}
