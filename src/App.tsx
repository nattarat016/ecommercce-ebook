import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Footer } from "./components/shared/Footer";
import { Navbar } from "./components/shared/Navbar";
import { HomePage, AboutPage } from "./pages";
import CartPage from "./pages/CartPage";
import { SignInPage } from "./pages/SignInPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import { CellPhonesPage } from "./pages/CellPhonesPage";
import { ErrorBoundary } from "./components/shared/ErrorBoundary";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route errorElement={<ErrorBoundary />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/nosotros" element={<AboutPage />} />
              <Route path="/signin" element={<SignInPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/celulares" element={<CellPhonesPage />} />
              <Route path="/celulares/:slug" element={<ProductDetailPage />} />
            </Route>
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
