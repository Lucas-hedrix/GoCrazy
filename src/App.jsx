import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { ToastProvider } from "./context/ToastContext";
import { UIProvider } from "./context/UIContext";
import Shell from "./components/Shell";
import Dashboard from "./pages/Dashboard";
import Collection from "./pages/Collection";
import Support from "./pages/Support";
import Auth from "./pages/Auth";
import Terms from "./pages/Terms";

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <UIProvider>
            <CartProvider>
              <Routes>
                <Route element={<Shell />}>
                  <Route index element={<Dashboard />} />
                  <Route path="collection" element={<Collection />} />
                  <Route path="support" element={<Support />} />
                  <Route path="terms" element={<Terms />} />
                </Route>
                <Route path="/auth" element={<Auth />} />
              </Routes>
            </CartProvider>
          </UIProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
