import { createBrowserRouter } from "react-router-dom";
import { RootLayout } from "../layouts/RootLayout";
import { HomePage, CellPhonesPage, AboutPage } from "../pages";
import { SignInPage } from "../pages/SignInPage";
import { SignUpPage } from "../pages/SignUpPage";
import { ProductDetailPage } from "../pages/ProductDetailPage";
import { ErrorBoundary } from "../components/shared/ErrorBoundary";
import { CheckoutPage } from "../pages/CheckoutPage";
import { OrderSuccessPage } from "../pages/OrderSuccessPage";
import { OrdersPage } from "../pages/OrdersPage";
import { AdminLayout } from "../layouts/AdminLayout";
import ProfilePage from "../pages/ProfilePage";
import { CartPage } from "../pages/CartPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "celulares",
        element: <CellPhonesPage />,
      },
      {
        path: "nosotros",
        element: <AboutPage />,
      },
      {
        path: "signin",
        element: <SignInPage />,
      },
      {
        path: "signup",
        element: <SignUpPage />,
      },
      {
        path: "cart",
        element: <CartPage />,
      },
      {
        path: "profile",
        element: <ProfilePage />,
      },
      {
        path: "ebooks/:slug",
        element: <ProductDetailPage />,
      },
      {
        path: "checkout",
        element: <CheckoutPage />,
      },
      {
        path: "order-success",
        element: <OrderSuccessPage />,
      },
      {
        path: "orders",
        element: <OrdersPage />,
      },
      
      {
        path: "*",
        element: <ErrorBoundary />,
      },
      {
        path: "admin",
        element: <AdminLayout />,
        children: [
          {
            path: "*",
            element: <ErrorBoundary />,
          },
        ],
      },
    ],
  },
]);
