import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
      const response = await axios.get("http://localhost:4000/api/services");
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
    <div className="mt-20 w-full max-w-10xl mx-auto">
      <div className="p-5 bg-gray-900 text-white rounded-lg shadow-md mb-9">
        <div className="grid grid-cols-2 gap-4">
          <Link to="/login" className="p-4 bg-green-500 hover:bg-green-600 text-white rounded w-full text-lg text-center">
            Đăng Nhập
          </Link>
          <Link to="/register" className="p-4 bg-blue-500 hover:bg-blue-600 text-white rounded w-full text-lg text-center">
            Đăng Ký
          </Link>
        </div>
      </div>

      <div className="p-16 bg-gray-800 text-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-5 text-left">Tạo Đơn Hàng Mới</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            className="p-4 bg-gray-700 text-white rounded-xl w-full text-lg"
            onChange={(e) => {
              setSelectedPlatform(e.target.value);
              setSelectedCategory("");
              setSelectedService("");
              setPrice(0);
              setQuantity("");
            }}
          >
            <option value="">Chọn Nền Tảng</option>
            {Object.keys(serviceData).map((platform) => (
              <option key={platform} value={platform}>
                {platform}
              </option>
            ))}
          </select>

          <select
            className="p-4 bg-gray-700 text-white rounded-xl w-full text-lg"
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setSelectedService("");
              setPrice(0);
              setQuantity("");
            }}
            disabled={!selectedPlatform}
          >
            <option value="">Phân Loại Dịch Vụ</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <select
            className="p-4 bg-gray-700 text-white rounded-xl w-full text-lg col-span-full"
            onChange={handleServiceChange}
            disabled={!selectedCategory}
          >
            <option value="">Dịch Vụ</option>
            {services.map((service) => (
              <option key={service.name} value={service.name}>
                {service.name}
              </option>
            ))}
          </select>

          {selectedService && (
            <div className="col-span-full p-4 bg-gray-900 text-white rounded-xl">
              {services
                .filter((service) => service.name === selectedService)
                .map((service) => (
                  <div key={service.name}>
                    <p className="text-lg font-bold">{service.name}</p>
                    <p>Giá: {service.price}đ / 1</p>
                    <p>Tốc độ: {service.speed}</p>
                  </div>
                ))}
            </div>
          )}

          <div className="col-span-full">
            <label className="block text-lg font-bold mb-2">Liên kết cần tăng</label>
            <input className="p-4 bg-gray-700 text-white rounded-xl w-full text-lg" placeholder="Nhập liên kết" />
          </div>

          <input
            className="p-4 bg-gray-700 text-white rounded-xl w-full text-lg"
            placeholder="Số lượng cần tăng"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />

          <input
            className="p-4 bg-gray-700 text-white rounded-xl w-full text-lg"
            placeholder="Giá tiền"
            type="text"
            value={price * (quantity ? parseInt(quantity) : 0) + "đ"}
            readOnly
          />
        </div>
        <div className="mt-6">
          <button className="bg-purple-500 hover:bg-purple-600 p-4 text-lg rounded-xl text-white w-full">
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
};

export default Order;
