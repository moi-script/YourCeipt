import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import Signup from './SignUp/SignUp'
import Login from './Login/Login'
import ForgotPassword from './Login/Forgot'
import Onboarding from './Onboard/Onboard'
import HomeLayout from './Home/DashBoard'
import BudgetDashboard from './Home/DashBoard'
import TransactionsPage from './Home/Transactions'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <TransactionsPage/>
  </StrictMode>,
)
