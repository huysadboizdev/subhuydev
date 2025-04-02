import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FiUsers, FiSettings, FiList, FiMail, FiMenu, FiX, FiLogOut, FiTrash2 } from "react-icons/fi";

const HomeAdmin = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [showUserManager, setShowUserManager] = useState(false);

  useEffect(() => {
    if (showUserManager) fetchUsers();
  }, [showUserManager]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get( import.meta.env.VITE_BACKEND_URL+"/admin/all-user");
      setUsers(response.data.users);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách người dùng:", error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) return;
    try {
      await axios.post(import.meta.env.VITE_BACKEND_URL+"/admin/delete-user", { userId });
      setUsers(users.filter((user) => user._id !== userId));
    } catch (error) {
      console.error("Lỗi khi xóa người dùng:", error);
    }
  };

  return (
    <div className="flex h-screen">
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-gray-800 text-white p-2 rounded-lg"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-gray-900 p-5 transform transition-transform md:translate-x-0 ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="text-white text-lg font-bold mb-6 text-center">Admin</div>
        <nav>
          <ul className="space-y-3">
            <li className="flex items-center gap-3 p-3 text-gray-300 hover:bg-gray-700 rounded-lg hover:text-white cursor-pointer"
                onClick={() => setShowUserManager(true)}>
              <FiUsers /> Quản lý Người dùng
            </li>
            <li className="flex items-center gap-3 p-3 text-gray-300 hover:bg-gray-700 rounded-lg hover:text-white">
              <FiList /> <Link to="/admin/services">Quản lý Dịch vụ</Link>
            </li>
            <li className="flex items-center gap-3 p-3 text-gray-300 hover:bg-gray-700 rounded-lg hover:text-white">
              <FiMail /> <Link to="/admin/contacts">Quản lý Liên hệ</Link>
            </li>
            <li className="flex items-center gap-3 p-3 text-gray-300 hover:bg-gray-700 rounded-lg hover:text-white">
              <FiSettings /> <Link to="/admin/settings">Cài đặt</Link>
            </li>
            <li className="flex items-center gap-3 p-3 text-white bg-red-500 rounded-lg shadow-md hover:bg-red-600">
              <Link to="/login" className="flex items-center gap-3 w-full">
                <FiLogOut /> Đăng Xuất
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      <div className={`p-6 w-full transition-all ${menuOpen ? "ml-0" : "md:ml-64"}`}>
        <div className="p-5 bg-gray-900 text-white rounded-lg shadow-md mb-4">
          <p>Chào mừng Admin trở lại!</p>
        </div>

        {showUserManager && (
          <div className="p-6 w-full">
            <h1 className="text-2xl font-bold mb-4">Quản lý Người dùng</h1>
            <table className="w-full bg-gray-800 text-white rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-700">
                  <th className="p-3 text-left">Tên</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="border-b border-gray-700">
                    <td className="p-3">{user.username}</td>
                    <td className="p-3">{user.email}</td>
                    <td className="p-3">
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="bg-red-500 p-2 rounded-lg hover:bg-red-600"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeAdmin;
