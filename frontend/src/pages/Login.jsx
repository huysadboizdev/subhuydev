import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setError("");

  //   try {
  //     const res = await axios.post("http://localhost:4000/api/user/login", {
  //       email,
  //       password,
  //     });

  //     if (res.data.success) {
  //       localStorage.setItem("token", res.data.accesstoken);
  //       alert("Đăng nhập thành công!");
  //       navigate("/home1"); // Điều hướng đến trang chính sau khi đăng nhập
  //     } else {
  //       setError(res.data.message);
  //     }
  //   } catch (err) {
  //     setError("Có lỗi xảy ra, vui lòng thử lại!");
  //   }
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
  
    try {
      const res = await axios.post(import.meta.env.VITE_BACKEND_URL+"/user/login", {
        email,
        password,
      });
  
      if (res.data.success) {
        localStorage.setItem("token", res.data.accesstoken);
        localStorage.setItem("username", res.data.username); // Lưu username vào localStorage
        alert("Đăng nhập thành công!");
        navigate("/home1"); // Điều hướng đến trang chính sau khi đăng nhập
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
        <h2 className="text-2xl font-bold text-center mb-4">Đăng nhập</h2>
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
            className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition"
          >
            Đăng nhập
          </button>
        </form>
        <p className="text-center mt-3">
          Chưa có tài khoản?{" "}
          <a href="/register" className="text-blue-500">Đăng ký ngay</a>
        </p>
      </div>
    </div>
  );
  
};

export default Login;
