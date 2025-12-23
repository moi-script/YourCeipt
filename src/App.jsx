import { Button } from "@/components/ui/button"
import { Toaster } from "sonner";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Login from "./Login/Login";
import Onboarding from "./Onboard/Onboard";
import BudgetSignup from "./SignUp/SignUp";
import { BudgetDashboard } from "./Home/DashBoard";
import TransactionsPage from "./Home/Transactions";
import { Home } from "./Home/Home";
import { AnalyticsDashBoards } from "./Home/Analyts";
import SettingsDashboard from "./Home/Settings";
import BudgetPage from "./Home/Budget";
import ForgotPassword from "./Login/Forgot";
import ProtectedRoute from "./ProtectedRoute";
import { AuthProvider } from "./context/authContext";


function App() {
  return (
    <>

    <AuthProvider>
     <BrowserRouter>
    
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/register" element={<BudgetSignup/>}/>
        <Route path="/forgot" element={<ForgotPassword/>}/>
        <Route path="/onboard" element={<Onboarding/>}/>
        
        <Route element={<ProtectedRoute/>}>
         <Route path="/user" element={<BudgetDashboard/>}>
           <Route path="/user/home" element={<Home/>}></Route>
           <Route path="/user/budgets" element={<BudgetPage/>}></Route>
           <Route path="/user/transactions" element={<TransactionsPage/>}></Route>
           <Route path="/user/analytics" element={<AnalyticsDashBoards/>}></Route>
           <Route path="/user/settings" element={<SettingsDashboard/>}></Route>
         </Route>
      </Route>
      
      </Routes>
     </BrowserRouter>   
      <Toaster position="top-right" richColors />
    
    </AuthProvider>
   
    </>
    
  )
}

// <>
//     <BudgetDashboard/>
//     <Toaster position="top-right" richColors />;
//     </>


export default App