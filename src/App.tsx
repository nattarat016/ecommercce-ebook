import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "./components/shared/ErrorBoundary";
import { Footer } from "./components/shared/Footer";
import { Navbar } from "./components/shared/Navbar";
import { AdminLayout } from "./layouts/AdminLayout";
import { HomePage, AboutPage } from "./pages";
import { CartPage } from "./pages/CartPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { OrdersPage } from "./pages/OrdersPage";
import { OrderSuccessPage } from "./pages/OrderSuccessPage";
import { ProductDetailPage } from "./pages/ProductDetailPage";
import { SignInPage } from "./pages/SignInPage";
import { SignUpPage } from "./pages/SignUpPage";
import { ToastProvider } from "./components/providers/ToastProvider";

function App() {
  return (
    <BrowserRouter>
      <ToastProvider />
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route errorElement={<ErrorBoundary />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/nosotros" element={<AboutPage />} />
              <Route path="/signin" element={<SignInPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/ebooks/:slug" element={<ProductDetailPage />} /> {/* เปลี่ยนจาก celulares เป็น ebooks */}
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/order-success" element={<OrderSuccessPage />} />
              <Route path="/orders" element={<OrdersPage />} />

              {/* Admin Routes */}
              <Route path="/admin" element={<AdminLayout />}>
              </Route>
            </Route>
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
