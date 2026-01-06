import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { Home } from "./Home/Home";
import Signup from "./SignUp/SignUp";
import Login from "./Login/Login";
// import ForgotPassword from "./Login/Forgot";
import Onboarding from "./Onboard/Onboard";
// import HomeLayout from './Home/DashBoard'
import { BudgetDashboard } from "./Home/DashBoard.jsx";
import TransactionsPage from "./Home/Transactions";
import Settings from "./Home/Settings";
import SettingsDashboard from "./Home/Settings";
import { AnalyticsDashBoards } from "./Home/Analyts";
import MultipleUpload from "./FileUploads";
import VideoLoader from "./components/loaders/AnimatedLoader";
import TransactionDashboardSkeleton from "./components/loaders/HomeSkeletonLoader";
import AIModelDashboard from "./Home/MyModels";
import UserMenu from "./Home/Logout";
import ProfilePage from "./Home/Profile";
import OrganicPrivacyPage from "./Home/PrivacySecurity";
import ReceiptDetailModal from "./components/ReceiptModal";
import { ManualEntryForm } from "./Input/ManualForm";
import { DialogForm } from "./Input/DialogForm";
import { AdvanceForm } from "./Input/AdvanceForm";
import LandingPage from "./Home/LandingPage";
import { BrowserRouter } from "react-router-dom";
import ForgotPassword from "./components/ForgotPassword";
// import AiEnginePage from "./components/AiEngine";
createRoot(document.getElementById("root")).render(
  <StrictMode>
      <App />
      {/* <ForgotPassword /> */}
  </StrictMode>
);
