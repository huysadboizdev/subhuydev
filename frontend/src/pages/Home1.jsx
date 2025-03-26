import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FiShoppingCart, FiList, FiCreditCard, FiUser, FiCode, FiLogIn, FiClock, FiDollarSign, FiMenu, FiX, FiLogOut } from "react-icons/fi";

const Home1 = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [serviceData, setServiceData] = useState({});
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState(0);

  useEffect(() => {
    fetchServices();
  }, []);

  

  const fetchServices = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/service");
      setServiceData(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu dịch vụ:", error);
    }
  };

  const categories = selectedPlatform ? serviceData[selectedPlatform]?.categories || [] : [];
  const services = selectedCategory ? serviceData[selectedPlatform]?.services[selectedCategory] || [] : [];

  const handleServiceChange = (e) => {
    const serviceName = e.target.value;
    setSelectedService(serviceName);
    setQuantity("");
    const service = services.find((s) => s.name === serviceName);
    setPrice(service ? service.price : 0);
  };

  return (
    <div className="flex h-screen">
      <button
        className="md:hidden sticky top-4 left-4 z-50 bg-gray-800 text-white p-2 rounded-lg"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-gray-900 p-5 transform transition-transform md:translate-x-0 ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="text-white text-lg font-bold mb-6 text-center">Dịch Vụ</div>
        <nav>
          <ul className="space-y-3">
            <li className="flex items-center gap-3 p-3 text-gray-300 hover:bg-gray-700 rounded-lg hover:text-white">
              <FiShoppingCart /> Đặt hàng
            </li>
            <li className="flex items-center gap-3 p-3 text-gray-300 hover:bg-gray-700 rounded-lg hover:text-white">
              <FiList /> Xem Dịch Vụ
            </li>
            <li className="flex items-center gap-3 p-3 text-gray-300 hover:bg-gray-700 rounded-lg hover:text-white">
              <FiClock /> Lịch Sử Đơn Hàng
            </li>
            <li className="flex items-center gap-3 p-3 text-gray-300 hover:bg-gray-700 rounded-lg hover:text-white">
              <FiCreditCard /> Nạp tiền (KM 10%)
            </li>
            <li className="flex items-center gap-3 p-3 text-gray-300 hover:bg-gray-700 rounded-lg hover:text-white">
              <FiDollarSign /> Dòng Tiền
            </li>
            <li className="flex items-center gap-3 p-3 text-gray-300 hover:bg-gray-700 rounded-lg hover:text-white">
              <FiUser /> Cài Đặt
            </li>
            <li className="flex items-center gap-3 p-3 text-gray-300 hover:bg-gray-700 rounded-lg hover:text-white">
              <FiCode /> API Đối Tác
            </li>
            <li className="flex items-center gap-3 p-3 text-white bg-green-500 rounded-lg shadow-md hover:bg-green-600">
                <Link to="/login" className="flex items-center gap-3 w-full">
                <FiLogOut /> Đăng Xuất
                </Link>
                
            </li>
          </ul>
        </nav>
      </aside>
      <div className={`p-0 w-full transition-all ${menuOpen ? "ml-0" : "md:ml-64"}`}>
        <div className="mt-20 w-full max-w-10xl mx-auto">
          <div className="p-5 bg-gray-900 text-white rounded-lg shadow-md mb-9">
          <img src="URL_AVATAR_CUA_BAN" alt="Avatar" className="w-10 h-10 rounded-full" />
            <p>Chào Mừng <span className="text-red-500 font-bold">{localStorage.getItem("username")}</span> ✅ Quay Trở Lại !</p> 
            <p>Đang KM 20% Giá Trị Nạp Tiền, Ae tranh thủ húp nhé !</p>
            <p>Cần Hỗ Trợ Thì 
            <button
                className="p-2 bg-yellow-400 text-black font-bold rounded-lg ml-2"
                onClick={() => window.open("https://zalo.me/84763076124", "_blank")}
              >
                Liên hệ Admin Qua ZALO
              </button>
              Hoặc
              <button
                className="p-2 bg-blue-400 text-red-600 font-bold rounded-lg ml-2"
                onClick={() => window.open("https://t.me/huydev204", "_blank")}
              >
                Liên hệ Admin Qua TELEGRAM
              </button>
              </p>
              <p>Nhóm Zalo Trao Đổi - Thông Báo
                <button
                  className="p-2 bg-green-500 text-white font-bold rounded-lg ml-2"
                  onClick={() => window.open("https://zalo.me/g/sfejxv466", "_blank")}
                >
                  Click Vào Nhóm Zalo
                </button>
              </p>

          </div>
          <div className="p-16 bg-gray-800 text-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-5 text-left">Tạo Đơn Hàng Mới</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select className="p-4 bg-gray-700 text-white rounded-xl w-full text-lg" onChange={(e) => setSelectedPlatform(e.target.value)}>
                <option value="">Chọn Nền Tảng</option>
                {Object.keys(serviceData).map((platform) => (
                  <option key={platform} value={platform}>{platform}</option>
                ))}
              </select>
              <select className="p-4 bg-gray-700 text-white rounded-xl w-full text-lg" onChange={(e) => setSelectedCategory(e.target.value)} disabled={!selectedPlatform}>
                <option value="">Phân Loại Dịch Vụ</option>
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <select className="p-4 bg-gray-700 text-white rounded-xl w-full text-lg col-span-full" onChange={handleServiceChange} disabled={!selectedCategory}>
                <option value="">Dịch Vụ</option>
                {services.map((service) => (
                  <option key={service.name} value={service.name}>{service.name}</option>
                ))}
              </select>
              <div className="col-span-full">
                <label className="block text-lg font-bold mb-2">Liên kết cần tăng</label>
              <input className="p-4 bg-gray-700 text-white rounded-xl w-full text-lg" placeholder="Nhập liên kết" />
              </div>
              <input className="p-4 bg-gray-700 text-white rounded-xl w-full text-lg" placeholder="Số lượng cần tăng" type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
              <input className="p-4 bg-gray-700 text-white rounded-xl w-full text-lg" placeholder="Giá tiền" type="text" value={price * (quantity ? parseInt(quantity) : 0) + "đ"} readOnly />
            </div>
            <button
              className="mt-6 bg-purple-500 hover:bg-purple-600 p-4 text-lg rounded-xl text-white w-full"
              onClick={() => {
                if (!selectedPlatform || !selectedCategory || !selectedService || !quantity || quantity <= 0) {
                  alert("Vui lòng chọn đầy đủ và nhập đủ số lượng dịch vụ.");
                } else {
                  alert("Tạo đơn hàng thành công!");
                }
              }}
            >
              Xác nhận
            </button>


          </div>
        </div>
      </div>
    </div>
  );
};

export default Home1;
