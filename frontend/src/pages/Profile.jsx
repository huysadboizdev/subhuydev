import React, { useState, useEffect } from "react";
import axios from "axios";

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.get(import.meta.env.VITE_BACKEND_URL + "/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(response.data.userData);
    } catch (error) {
      console.error("Lỗi khi lấy thông tin người dùng:", error);
    }
  };

  if (!user) return <p>Đang tải thông tin...</p>;

  return (
    <div className="p-5 bg-gray-800 text-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Thông Tin Người Dùng</h2>
      <p><strong>Tên:</strong> {user.username}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Số Điện Thoại:</strong> {user.phone}</p>
      <p><strong>Ngày Sinh:</strong> {user.dob}</p>
      <p><strong>Số Dư:</strong> {user.balance}đ</p>
      {user.image && (
        <img src={user.image} alt="Avatar" className="w-20 h-20 rounded-full mt-4" />
      )}
    </div>
  );
};

export default Profile;
