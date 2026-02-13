import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import BusinessPage from "./pages/BusinessPage";
import BusinessProfile from "./pages/BusinessProfile";

import { Toaster } from "react-hot-toast";
import AdminDashboard from "./pages/AdminPanel";
import { ProtectedClientRoute } from "./components/protectedComponents/ProtectedClientRoute";
import { ProtectedAdminRoute } from "./components/protectedComponents/ProtectedAdminRoute";

function App() {
  return (
    <div>
      <Toaster position="top-center" reverseOrder={false} />
      <Layout>
        <Routes>
          {/* Publiques */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/b/:slug" element={<BusinessPage />} />

          {/* Client/Vendeur protégé */}
          <Route
            path="/dashboard"
            element={
              <ProtectedClientRoute>
                <Dashboard />
              </ProtectedClientRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedClientRoute>
                <BusinessProfile />
              </ProtectedClientRoute>
            }
          />

          {/* Admin protégé */}
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedAdminRoute>
                <AdminDashboard />
              </ProtectedAdminRoute>
            }
          />

          {/* 404 */}
        </Routes>
      </Layout>
    </div>
  );
}

export default App;
