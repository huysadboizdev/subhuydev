import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EditProfile from '../components/Editprofile.jsx';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(import.meta.env.VITE_BACKEND_URL + '/user/get-user', {
          headers: { token }
        });

        if (res.data.success) {
          setUser(res.data.user);
        } else {
          alert(res.data.message);
        }
      } catch (error) {
        console.error(error);
        alert('Lỗi khi lấy thông tin người dùng');
      }
    };

    fetchProfile();
  }, [editing]);

  if (!user) return <div>Loading...</div>;

  return (
    <div className="h-screen flex justify-center items-center">
      <div className="max-w-3xl w-full p-8 bg-white shadow rounded-xl">
        <h1 className="text-2xl font-bold mb-4">Thông tin cá nhân</h1>

        {!editing ? (
          <>
            <div className="space-y-4 mb-4">
              {user.image && (
                <div className="flex flex-col items-center">
                  <label className="font-semibold text-gray-700 mb-2">Ảnh đại diện:</label>
                  <img src={user.image} alt="avatar" className="w-32 h-32 rounded-full" />
                </div>
              )}
             
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Tài khoản:</label>
                <input
                  type="text"
                  value={user.username}
                  disabled
                  className="w-full px-4 py-2 bg-gray-100 rounded border border-gray-300"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Email:</label>
                <input
                  type="text"
                  value={user.email}
                  disabled
                  className="w-full px-4 py-2 bg-gray-100 rounded border border-gray-300"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Số điện thoại:</label>
                <input
                  type="text"
                  value={user.phone}
                  disabled
                  className="w-full px-4 py-2 bg-gray-100 rounded border border-gray-300"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Ngày sinh:</label>
                <input
                  type="text"
                  value={user.dob}
                  disabled
                  className="w-full px-4 py-2 bg-gray-100 rounded border border-gray-300"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Số dư:</label>
                <input
                  type="text"
                  value={Number(user.balance).toLocaleString('vi-VN')}
                  disabled
                  className="w-full px-4 py-2 bg-gray-100 rounded border border-gray-300"
                />
              </div>
            </div>


            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={() => setEditing(true)}
            >
              Chỉnh sửa thông tin
            </button>
          </>
        ) : (
          <>
            <EditProfile user={user} />
            <button
              className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              onClick={() => setEditing(false)}
            >
              Cập nhật thông tin
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
