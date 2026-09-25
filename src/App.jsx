import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./components/Toaster.jsx";
import AppUpdatePrompt from "./components/AppUpdatePrompt.jsx";
import { isNativeApp } from "./lib/appRelease";

// Each route is its own chunk. Before, every page (Recharts, the dashboard,
// all forms) shipped in one 1.2 MB bundle, including to the landing page.
const LandingPage = lazy(() => import("./Home/LandingPage"));
// The Android app opens on a splash and sign-in, not the marketing page.
const AppEntry = lazy(() => import("./Home/AppEntry"));
const Login = lazy(() => import("./Login/Login"));
const LegalPage = lazy(() => import("./components/LegalPage"));
const BudgetSignup = lazy(() => import("./SignUp/SignUp"));
const ForgotPassword = lazy(() => import("./Login/Forgot"));
const Onboarding = lazy(() => import("./Onboard/Onboard"));
const AiEnginePage = lazy(() => import("./components/AiEngine"));
const BudgetDashboard = lazy(() => import("./Home/DashBoard").then((m) => ({ default: m.BudgetDashboard })));
const Home = lazy(() => import("./Home/Home").then((m) => ({ default: m.Home })));
const BudgetPage = lazy(() => import("./Home/Budget"));
const AIModelDashboard = lazy(() => import("./Home/MyModels"));
const TransactionsPage = lazy(() => import("./Home/Transactions"));
const AnalyticsDashBoards = lazy(() => import("./Home/Analyts").then((m) => ({ default: m.AnalyticsDashBoards })));
const ProfilePage = lazy(() => import("./Home/Profile"));
const OrganicPrivacyPage = lazy(() => import("./Home/PrivacySecurity"));

const RouteFallback = () => <div className="min-h-screen bg-[#f7f6f2] dark:bg-stone-950" />;

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <BrowserRouter>
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/" element={isNativeApp() ? <AppEntry /> : <LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/legal" element={<LegalPage />} />
              <Route path="/register" element={<BudgetSignup />} />
              <Route path="/forgot" element={<ForgotPassword />} />
              <Route path="/onboard" element={<Onboarding />} />
              <Route path="/aiEngine" element={<AiEnginePage />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/user" element={<BudgetDashboard />}>
                  <Route path="/user/" element={<Home />} />
                  <Route path="/user/budgets" element={<BudgetPage />} />
                  <Route path="/user/models" element={<AIModelDashboard />} />
                  <Route path="/user/transactions" element={<TransactionsPage />} />
                  <Route path="/user/analytics" element={<AnalyticsDashBoards />} />
                  <Route path="/user/profile" element={<ProfilePage />} />
                  <Route path="/user/privacy" element={<OrganicPrivacyPage />} />
                </Route>
              </Route>
            </Routes>
          </Suspense>
          <AppUpdatePrompt />
        </BrowserRouter>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
