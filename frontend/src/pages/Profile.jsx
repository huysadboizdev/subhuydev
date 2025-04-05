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
    <div className="max-w-md mx-auto p-4 bg-white shadow rounded-xl mt-10">
      <h1 className="text-2xl font-bold mb-4">Thông tin cá nhân</h1>

      {!editing ? (
        <>
          <div className="space-y-2 mb-4">
            <div><strong>Username:</strong> {user.username}</div>
            <div><strong>Email:</strong> {user.email}</div>
            <div><strong>Số điện thoại:</strong> {user.phone}</div>
            <div><strong>Ngày sinh:</strong> {user.dob}</div>
            <div><strong>Số dư:</strong> {user.balance} VNĐ</div>
            {user.image && (
              <div>
                <strong>Ảnh đại diện:</strong><br />
                <img src={user.image} alt="avatar" className="w-32 h-32 rounded-full mt-2" />
              </div>
            )}
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
  );
};

export default Profile;
