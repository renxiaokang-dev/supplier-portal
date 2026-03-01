import { createHashRouter } from "react-router";
import { Root } from "./pages/Root";
import { QuotationQuery } from "./pages/QuotationQuery";
import { QuotationUploadPage } from "./pages/QuotationUploadPage";
import { Login } from "./pages/Login";
import { AccountSetup } from "./pages/AccountSetup";
import { ChangePassword } from "./pages/ChangePassword";
import { ForgotPassword } from "./pages/ForgotPassword";
import { PodPenalty } from "./pages/PodPenalty";
import { UserManagement } from "./pages/UserManagement";
import { RoleManagement } from "./pages/RoleManagement";
import { TimesheetEntry } from "./pages/TimesheetEntry";
import { PaymentRequest } from "./pages/PaymentRequest";
import { Demo } from "./pages/Demo";

export const router = createHashRouter([
  {
    path: "/demo",
    element: <Demo />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/first-login",
    element: <Login isFirstLogin={true} />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/account-setup",
    element: <AccountSetup />,
  },
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: QuotationQuery },
      { path: "upload", Component: QuotationUploadPage },
      { path: "query", Component: QuotationQuery },
      { path: "change-password", Component: ChangePassword },
      { path: "pod-penalty", Component: PodPenalty },
      { path: "user-management", Component: UserManagement },
      { path: "role-management", Component: RoleManagement },
      { path: "timesheet", Component: TimesheetEntry },
      { path: "payment-request", Component: PaymentRequest },
    ],
  },
]);