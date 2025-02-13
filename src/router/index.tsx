import { createBrowserRouter } from "react-router-dom";
import { RootLayout } from "../layouts/RootLayout";
import { HomePage, CellPhonesPage, AboutPage } from "../pages";
import { SignInPage } from "../pages/SignInPage";
import { SignUpPage } from "../pages/SignUpPage";
import ProductDetailPage from "../pages/ProductDetailPage";
import { ErrorBoundary } from "../components/shared/ErrorBoundary";
import { CheckoutPage } from "../pages/CheckoutPage";
import { OrderSuccessPage } from "../pages/OrderSuccessPage";
import { OrdersPage } from "../pages/OrdersPage";
import { AdminLayout } from "../layouts/AdminLayout";
import AdminProductsPage from "../pages/admin/AdminProductsPage";
import ProductFormPage from "../pages/admin/ProductFormPage";
import { DashboardPage } from "../pages/admin/DashboardPage";
import ProfilePage from "../pages/ProfilePage";
import { AdminOrdersPage } from "../pages/admin/AdminOrdersPage";
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
        path: "celulares/:slug",
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
            index: true,
            element: <DashboardPage />,
          },
          {
            path: "orders",
            element: <AdminOrdersPage />,
          },
          {
            path: "products",
            element: <AdminProductsPage />,
          },
          {
            path: "products/new",
            element: <ProductFormPage />,
          },
          {
            path: "products/edit/:id",
            element: <ProductFormPage />,
          },
          {
            path: "*",
            element: <ErrorBoundary />,
          },
        ],
      },
    ],
  },
]);
