import React, { useState, useEffect } from "react";
import axios from "axios";

const ServicesList = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(import.meta.env.VITE_BACKEND_URL + "/user/services");
        setServices(response.data.services);
        setLoading(false);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách dịch vụ:", error);
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return <div>Đang tải...</div>;
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4 text-white">Danh Sách Dịch Vụ</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {services.map((service) => (
          <div key={service._id} className="p-6 bg-gray-700 text-white rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
            <p className="mb-2">Nền tảng: {service.platform}</p>
            <p className="mb-2">Phân loại: {service.category}</p>
            <p className="mb-2">Giá: {service.price}đ</p>
            <p className="mb-2">Tốc độ: {service.speed}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicesList;
