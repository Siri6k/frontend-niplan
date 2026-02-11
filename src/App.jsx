import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import BusinessPage from "./pages/BusinessPage";

import { Toaster } from "react-hot-toast";
import AdminDashboard from "./pages/AdminPanel";
import { ProtectedAdminRoute } from "./utils/Constants";

function App() {
  return (
    <div>
      <Toaster position="top-center" reverseOrder={false} />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/b/:slug" element={<BusinessPage />} />
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedAdminRoute>
                <AdminDashboard />
              </ProtectedAdminRoute>
            }
          />
        </Routes>
      </Layout>
    </div>
  );
}

export default App;
