import React, { useState } from 'react';
import axios from 'axios';

const EditProfile = ({ user }) => {
  const [username, setUsername] = useState(user.username || '');
  const [phone, setPhone] = useState(user.phone || '');
  const [dob, setDob] = useState(user.dob || '');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('userId', user._id);
    formData.append('username', username);
    formData.append('phone', phone);
    formData.append('dob', dob);
    if (image) formData.append('image', image);

    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(import.meta.env.VITE_BACKEND_URL + '/user/update-profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          token,
        },
      });

      if (res.data.success) {
        alert('Cập nhật thông tin thành công!');
        // Cập nhật lại thông tin trong Profile sau khi chỉnh sửa thành công
        user.username = username;
        user.phone = phone;
        user.dob = dob;
        user.image = res.data.image || user.image;
      } else {
        alert(res.data.message);
      }
    } catch (error) {
      console.error(error);
      alert('Lỗi khi cập nhật thông tin');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block font-semibold">Tên người dùng</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        />
      </div>

      <div>
        <label className="block font-semibold">Số điện thoại</label>
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        />
      </div>

      <div>
        <label className="block font-semibold">Ngày sinh</label>
        <input
          type="date"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        />
      </div>

      <div>
        <label className="block font-semibold">Ảnh đại diện</label>
        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
          className="w-full px-3 py-2 border rounded"
        />
      </div>

      <button
        type="submit"
        className={`w-full py-2 text-white rounded ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
        disabled={loading}
      >
        {loading ? 'Đang cập nhật...' : 'Lưu thay đổi'}
      </button>
    </form>
  );
};

export default EditProfile;
