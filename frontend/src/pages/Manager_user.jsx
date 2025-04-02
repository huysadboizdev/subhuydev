import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiTrash2 } from "react-icons/fi";

const Manager_user = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(import.meta.env.VITE_BACKEND_URL+"/admin/all-user");
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
              <td className="p-3">{user.name}</td>
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
  );
};

export default Manager_user;