import { Toaster } from "react-hot-toast"

import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import SignupPage from "./pages/SignupPage"
import { Routes, Route} from "react-router-dom"


import Layout from "./components/Layout"
import DashboardAdmin from "./pages/DashboardAdmin"
import DashboardMember from "./pages/DashboardMember"

function App() {

  return (
    <div>
      <Routes>
        <Route path="/" element={<Layout/>}>
        {/* public routes */}
            <Route index element={<HomePage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="signup" element={<SignupPage />} />

        {/* protected routes */}
            <Route path="dashboard-admin" element={<DashboardAdmin/>}/>
            <Route path="dashboard-member" element={<DashboardMember/>}/>

        </Route>
      </Routes>
      <Toaster  position="top-left"  reverseOrder={false}/>
    </div>
  )
}

export default App
