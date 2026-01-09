import React, { useEffect, useState } from "react";
import api from "../api";
import { normalizedPhoneNumber } from "../utils/Constants";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [otps, setOtps] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const [resUsers, resOtps] = await Promise.all([
        api.get("/admin/users/"),
        api.get("/admin/otps/"),
      ]);
      setUsers(resUsers.data);
      setOtps(resOtps.data);
    };
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <header className=" p-4 shadow mt-0 bg-gray-800 flex justify-center">
        <h1 className="text-2xl  font-bold text-white bg-gray-600 inline-block px-4 py-2 rounded">
          Panneau d'Administration
        </h1>
      </header>
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tableau des OTP (Codes) */}
        <div className="bg-white p-4 rounded shadow dark:bg-gray-800">
          <h2 className="text-xl font-bold mb-4 text-orange-600">
            Derniers Codes OTP
          </h2>
          <div className="h-96 overflow-y-auto">
            <table className="w-full text-sm text-left dark:text-gray-200">
              <thead className="bg-orange-50 dark:bg-gray-700">
                <tr>
                  <th className="p-2">Numéro</th>
                  <th className="p-2">Code</th>
                  <th className="p-2">Heure</th>
                </tr>
              </thead>
              <tbody>
                {otps.map((o) => (
                  <tr key={o.id} className="border-b hover:bg-orange-100">
                    <td className="p-2 font-mono">
                      {normalizedPhoneNumber(o.phone)}
                    </td>
                    <td className="p-2 font-bold text-blue-600">{o.code}</td>
                    <td className="p-2 text-gray-500">{o.created_at}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* Tableau des Utilisateurs */}
        <div className="bg-white p-4 rounded shadow dark:bg-gray-800">
          <h2 className="text-xl font-bold mb-4">
            Utilisateurs ({users.length})
          </h2>
          <div className="h-96 overflow-y-auto ">
            <table className="w-full text-sm dark:text-gray-200">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th className="p-2 text-left">Téléphone</th>
                  <th className="p-2">Statut</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b">
                    <td className="p-2">{normalizedPhoneNumber(u.phone)}</td>
                    <td className="p-2 text-center">
                      {u.is_active ? "✅" : "⏳"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AdminDashboard;
