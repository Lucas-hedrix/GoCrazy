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
import Checkout from "./pages/Checkout";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminOverview from "./pages/admin/AdminOverview";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";

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
                  <Route path="checkout" element={<Checkout />} />
                </Route>
                <Route path="/auth" element={<Auth />} />
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminOverview />} />
                  <Route path="products" element={<AdminProducts />} />
                  <Route path="orders" element={<AdminOrders />} />
                </Route>
              </Routes>
            </CartProvider>
          </UIProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
