import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login_admin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://localhost:4000/api/admin/login", {
        email,
        password,
      });

      if (res.data.success) {
        localStorage.setItem("adminToken", res.data.accesstoken);
        localStorage.setItem("adminUsername", res.data.username);
        alert("Đăng nhập admin thành công!");
        navigate("/admin/home_admin");
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      setError("Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-4">Admin Đăng Nhập</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              className="w-full p-2 border rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="block mb-1 font-medium">Mật khẩu</label>
            <input
              type="password"
              className="w-full p-2 border rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
          >
            Đăng nhập Admin
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login_admin;
