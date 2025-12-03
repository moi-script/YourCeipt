import { Button } from "@/components/ui/button"
import {BudgetDashboard} from "./Home/DashBoard"
import { Toaster } from "sonner";
function App() {
  return (
    <>
    <BudgetDashboard/>
    <Toaster position="top-right" richColors />;
    </>
  )
}

export default App