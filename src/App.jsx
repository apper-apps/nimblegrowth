import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import Layout from "@/components/organisms/Layout"
import Explorer from "@/components/pages/Explorer"
import Tester from "@/components/pages/Tester"
import Workflows from "@/components/pages/Workflows"
import Recipes from "@/components/pages/Recipes"
import Dashboard from "@/components/pages/Dashboard"
import MarketingDashboard from "@/components/pages/MarketingDashboard"
import { UserModeProvider } from "@/contexts/UserModeContext"

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background text-white font-body">
        <Layout>
<UserModeProvider>
            <Routes>
              <Route path="/" element={<Navigate to="/explorer" replace />} />
              <Route path="/explorer" element={<Explorer />} />
              <Route path="/tester" element={<Tester />} />
              <Route path="/workflows" element={<Workflows />} />
              <Route path="/recipes" element={<Recipes />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/marketing" element={<MarketingDashboard />} />
            </Routes>
          </UserModeProvider>
        </Layout>
        <ToastContainer 
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </div>
    </BrowserRouter>
  )
}

export default App