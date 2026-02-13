import React, { useEffect, useState, useCallback } from "react";
import api from "../api";
import { normalizedPhoneNumber } from "../utils/Constants";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Users,
  Key,
  LogOut,
  Search,
  RefreshCw,
  Shield,
  Store,
  CheckCircle,
  Clock,
  XCircle,
  Filter,
  ChevronDown,
  ChevronUp,
  MoreVertical,
  Phone,
  Calendar,
  TrendingUp,
  AlertCircle,
} from "lucide-react";

const useTimeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return "À l'instant";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `Il y a ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Il y a ${hours}h`;
  const days = Math.floor(hours / 24);
  return `Il y a ${days}j`;
};

const StatCard = ({ icon: Icon, label, value, color, trend }) => (
  <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-slate-700">
    <div className="flex items-center justify-between">
      <div className={`p-3 rounded-xl ${color} bg-opacity-10`}>
        <Icon size={24} className={color.replace("bg-", "text-")} />
      </div>
      {trend && (
        <span className="text-xs font-medium text-green-600 flex items-center gap-1">
          <TrendingUp size={12} />
          {trend}
        </span>
      )}
    </div>
    <p className="text-2xl font-bold mt-3 text-gray-900 dark:text-white">
      {value}
    </p>
    <p className="text-sm text-gray-500 dark:text-slate-400">{label}</p>
  </div>
);

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [otps, setOtps] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filteredOtps, setFilteredOtps] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview"); // overview, users, otps
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    pendingUsers: 0,
    todayOtps: 0,
  });

  const navigate = useNavigate();

  // Vérification auth
  useEffect(() => {
    const isAdmin = localStorage.getItem("role");
    if (isAdmin !== "superadmin") {
      toast.error("Accès refusé : Administrateurs uniquement");
      navigate("/dashboard");
    } else {
      loadData();
    }
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [resUsers, resOtps] = await Promise.all([
        api.get("/admin/users/"),
        api.get("/admin/otps/"),
      ]);

      setUsers(resUsers.data);
      setFilteredUsers(resUsers.data);
      setOtps(resOtps.data);
      setFilteredOtps(resOtps.data);

      // Calcul stats
      const active = resUsers.data.filter((u) => u.is_active).length;
      const today = new Date().toDateString();
      const todayOtps = resOtps.data.filter(
        (o) => new Date(o.created_at).toDateString() === today,
      ).length;

      setStats({
        totalUsers: resUsers.data.length,
        activeUsers: active,
        pendingUsers: resUsers.data.length - active,
        todayOtps,
      });

      toast.success("Dashboard admin chargé");
    } catch (error) {
      toast.error("Erreur de chargement des données");
    } finally {
      setIsLoading(false);
    }
  };

  // Filtrage
  useEffect(() => {
    const query = searchQuery.toLowerCase();

    setFilteredUsers(
      users.filter(
        (u) =>
          normalizedPhoneNumber(u.phone_whatsapp)
            .toLowerCase()
            .includes(query) || u.business_name?.toLowerCase().includes(query),
      ),
    );

    setFilteredOtps(
      otps.filter(
        (o) =>
          normalizedPhoneNumber(o.phone_number).toLowerCase().includes(query) ||
          o.code.includes(query),
      ),
    );
  }, [searchQuery, users, otps]);

  const handleSort = (key) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key, direction });

    const sorted = [...filteredUsers].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });
    setFilteredUsers(sorted);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
    toast.success("Déconnecté");
  };

  const handleActivateUser = async (userId) => {
    try {
      await api.post(`/admin/users/${userId}/activate/`);
      toast.success("Utilisateur activé");
      loadData();
    } catch {
      toast.error("Erreur d'activation");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b dark:border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <Shield size={20} className="text-white" />
            </div>
            <div>
              <h1 className="font-bold text-gray-900 dark:text-white">
                Admin Niplan
              </h1>
              <p className="text-xs text-gray-500 dark:text-slate-400">
                Super Administrateur
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadData}
              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
              title="Rafraîchir"
            >
              <RefreshCw size={20} />
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Déconnexion</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            icon={Users}
            label="Total vendeurs"
            value={stats.totalUsers}
            color="bg-blue-500"
            trend="+12%"
          />
          <StatCard
            icon={CheckCircle}
            label="Actifs"
            value={stats.activeUsers}
            color="bg-green-500"
          />
          <StatCard
            icon={Clock}
            label="En attente"
            value={stats.pendingUsers}
            color="bg-amber-500"
          />
          <StatCard
            icon={Key}
            label="Codes aujourd'hui"
            value={stats.todayOtps}
            color="bg-purple-500"
          />
        </div>

        {/* Search & Tabs */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border dark:border-slate-800 p-4">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search
                size={20}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Rechercher par téléphone, nom..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-slate-800 rounded-xl border-0 focus:ring-2 focus:ring-blue-500 dark:text-white"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab("users")}
                className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                  activeTab === "users"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400"
                }`}
              >
                Vendeurs
              </button>
              <button
                onClick={() => setActiveTab("otps")}
                className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                  activeTab === "otps"
                    ? "bg-orange-600 text-white"
                    : "bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400"
                }`}
              >
                Codes OTP
              </button>
            </div>
          </div>

          {/* Table Users */}
          {(activeTab === "users" || activeTab === "overview") && (
            <div className={activeTab === "overview" ? "mb-6" : ""}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Store size={20} className="text-blue-600" />
                  Vendeurs ({filteredUsers.length})
                </h2>
                {activeTab === "overview" && (
                  <button
                    onClick={() => setActiveTab("users")}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Voir tout →
                  </button>
                )}
              </div>

              <div className="overflow-x-auto rounded-xl border dark:border-slate-700">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 dark:bg-slate-800">
                    <tr>
                      <th
                        className="p-3 text-left font-medium text-gray-600 dark:text-slate-400 cursor-pointer hover:text-gray-900"
                        onClick={() => handleSort("phone")}
                      >
                        <div className="flex items-center gap-1">
                          <Phone size={14} />
                          Téléphone
                          {sortConfig.key === "phone" &&
                            (sortConfig.direction === "asc" ? (
                              <ChevronUp size={14} />
                            ) : (
                              <ChevronDown size={14} />
                            ))}
                        </div>
                      </th>
                      <th className="p-3 text-left font-medium text-gray-600 dark:text-slate-400">
                        Business
                      </th>
                      <th className="p-3 text-center font-medium text-gray-600 dark:text-slate-400">
                        Type
                      </th>
                      <th className="p-3 text-center font-medium text-gray-600 dark:text-slate-400">
                        Statut
                      </th>
                      <th className="p-3 text-right font-medium text-gray-600 dark:text-slate-400">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y dark:divide-slate-700">
                    {filteredUsers
                      .slice(0, activeTab === "overview" ? 5 : undefined)
                      .map((user) => (
                        <tr
                          key={user.id}
                          className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors"
                        >
                          <td className="p-3 font-mono text-gray-900 dark:text-slate-200">
                            {normalizedPhoneNumber(user.phone_whatsapp)}
                          </td>
                          <td className="p-3 text-gray-600 dark:text-slate-400">
                            {user.business_name || "-"}
                          </td>
                          <td className="p-3 text-center">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                user.business_type === "TROC"
                                  ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                                  : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                              }`}
                            >
                              {user.business_type || "VENTE"}
                            </span>
                          </td>
                          <td className="p-3 text-center">
                            {user.is_active ? (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs font-medium">
                                <CheckCircle size={12} />
                                Actif
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 text-xs font-medium">
                                <Clock size={12} />
                                En attente
                              </span>
                            )}
                          </td>
                          <td className="p-3 text-right">
                            {!user.is_active && (
                              <button
                                onClick={() => handleActivateUser(user.id)}
                                className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors"
                              >
                                Activer
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Table OTPs */}
          {(activeTab === "otps" || activeTab === "overview") && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Key size={20} className="text-orange-600" />
                  Codes OTP récents ({filteredOtps.length})
                </h2>
                {activeTab === "overview" && (
                  <button
                    onClick={() => setActiveTab("otps")}
                    className="text-sm text-orange-600 hover:underline"
                  >
                    Voir tout →
                  </button>
                )}
              </div>

              <div className="overflow-x-auto rounded-xl border dark:border-slate-700">
                <table className="w-full text-sm">
                  <thead className="bg-orange-50 dark:bg-slate-800">
                    <tr>
                      <th className="p-3 text-left font-medium text-orange-900 dark:text-orange-400">
                        <div className="flex items-center gap-1">
                          <Phone size={14} />
                          Numéro
                        </div>
                      </th>
                      <th className="p-3 text-left font-medium text-orange-900 dark:text-orange-400">
                        Code
                      </th>
                      <th className="p-3 text-left font-medium text-orange-900 dark:text-orange-400">
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          Il y a
                        </div>
                      </th>
                      <th className="p-3 text-center font-medium text-orange-900 dark:text-orange-400">
                        Statut
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y dark:divide-slate-700">
                    {filteredOtps
                      .slice(0, activeTab === "overview" ? 5 : undefined)
                      .map((otp) => (
                        <tr
                          key={otp.id}
                          className="hover:bg-orange-50/50 dark:hover:bg-slate-800/50 transition-colors"
                        >
                          <td className="p-3 font-mono text-gray-900 dark:text-slate-200">
                            {normalizedPhoneNumber(otp.phone_number)}
                          </td>
                          <td className="p-3">
                            <span className="font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded-lg">
                              {otp.code}
                            </span>
                          </td>
                          <td className="p-3 text-gray-500 dark:text-slate-400 text-xs">
                            {useTimeAgo(otp.updated_at)}
                          </td>
                          <td className="p-3 text-center">
                            {otp.is_used ? (
                              <span className="inline-flex items-center gap-1 text-green-600 text-xs">
                                <CheckCircle size={12} />
                                Utilisé
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-amber-600 text-xs">
                                <AlertCircle size={12} />
                                En attente
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
