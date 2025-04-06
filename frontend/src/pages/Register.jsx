import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    password_1: "",
    password_2: "",
    dob: "",
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(import.meta.env.VITE_BACKEND_URL+"/user/register", formData);
      setMessage(res.data.message);
      if (res.data.success) {
        setTimeout(() => {
          setMessage("Đăng ký thành công!");
          setTimeout(() => navigate("/login"), 2000);
        }, 1000);
      }
    } catch (error) {
      setMessage("Đã xảy ra lỗi!");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="bg-pink-100 p-6 rounded-lg shadow-lg w-96"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Đăng Ký</h2>
        {message && <p className="text-green-500 text-center">{message}</p>}
        <input type="text" name="username" placeholder="Tên đăng nhập" value={formData.username} onChange={handleChange} required className="w-full p-2 border rounded mb-2" />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required className="w-full p-2 border rounded mb-2" />
        <input type="text" name="phone" placeholder="Số điện thoại" value={formData.phone} onChange={handleChange} required className="w-full p-2 border rounded mb-2" />
        <input type="password" name="password_1" placeholder="Mật khẩu" value={formData.password_1} onChange={handleChange} required className="w-full p-2 border rounded mb-2" />
        <input type="password" name="password_2" placeholder="Nhập lại mật khẩu" value={formData.password_2} onChange={handleChange} required className="w-full p-2 border rounded mb-2" />
        <input type="date" name="dob" value={formData.dob} onChange={handleChange} required className="w-full p-2 border rounded mb-2" />
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded mb-2">Đăng Ký</button>
        <button onClick={() => navigate("/login")} className="w-full bg-green-500 text-white p-2 rounded">Đăng Nhập</button>
      </form>
    </div>
  );
};

export default Register;
