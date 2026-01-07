import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import BusinessPage from "./pages/BusinessPage";

import { Toaster } from "react-hot-toast";

function App() {
  return (
    <div>
      <Toaster position="top-center" reverseOrder={false} />
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/b/:slug" element={<BusinessPage />} />
          </Routes>
        </Layout>
      </Router>
    </div>
  );
}

export default App;
