import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { Home } from "./Home/Home";
import Signup from "./SignUp/SignUp";
import Login from "./Login/Login";
import ForgotPassword from "./Login/Forgot";
import Onboarding from "./Onboard/Onboard";
// import HomeLayout from './Home/DashBoard'
import { BudgetDashboard } from "./Home/DashBoard.jsx";
import TransactionsPage from "./Home/Transactions";
import Settings from "./Home/Settings";
import SettingsDashboard from "./Home/Settings";
import { AnalyticsDashBoards } from "./Home/Analyts";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
