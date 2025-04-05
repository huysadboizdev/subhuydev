import React, { useState, useEffect } from "react";
import axios from "axios";

const Order = () => {
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
      const response = await axios.get(import.meta.env.VITE_BACKEND_URL + "/api/user/services");
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
    <div className="h-screen flex justify-center items-center">
      <div className="p-16 text-white rounded-lg shadow-md w-full max-w-3xl">
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
  );
};

export default Order;
