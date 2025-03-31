import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiTrash2, FiEdit } from "react-icons/fi";

const ManagerService = () => {
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState({ platform: "", category: "", name: "", price: "", speed: "" });
  const [editService, setEditService] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/admin/list");
      if (response.data.success) {
        setServices(response.data.services);
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách dịch vụ:", error);
    }
  };

  const handleDeleteService = async (serviceId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa dịch vụ này?")) return;
    try {
      const response = await axios.post("http://localhost:4000/api/admin/delete-service", { serviceId });
      if (response.data.success) {
        setServices((prev) => prev.filter((service) => service._id !== serviceId));
      }
    } catch (error) {
      console.error("Lỗi khi xóa dịch vụ:", error);
    }
  };

  const handleAddService = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:4000/api/admin/add-service", newService);
      if (response.data.success) {
        setServices((prev) => [...prev, response.data.newService]);
        setNewService({ platform: "", category: "", name: "", price: "", speed: "" });
        setMessage("Thêm dịch vụ thành công!");
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (error) {
      setMessage("Lỗi khi thêm dịch vụ.");
    }
  };

  const handleEditService = (service) => {
    setEditService(service);
    setNewService(service);
  };

  const handleUpdateService = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:4000/api/admin/edit-service", { ...newService, serviceId: editService._id });
      if (response.data.success) {
        setServices((prev) =>
          prev.map((service) => (service._id === editService._id ? response.data.updatedService : service))
        );
        setEditService(null);
        setNewService({ platform: "", category: "", name: "", price: "", speed: "" });
        setMessage("Cập nhật dịch vụ thành công!");
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (error) {
      setMessage("Lỗi khi cập nhật dịch vụ.");
    }
  };

  return (
    <div className="p-6 w-full">
      <h1 className="text-2xl font-bold mb-4">Quản lý Dịch vụ</h1>
      {message && <div className="bg-green-500 text-white p-2 mb-4 rounded">{message}</div>}
      <form onSubmit={editService ? handleUpdateService : handleAddService} className="mb-4 bg-gray-800 p-4 rounded-lg">
        <input type="text" placeholder="Nền tảng" className="input" value={newService.platform} onChange={(e) => setNewService({ ...newService, platform: e.target.value })} required />
        <input type="text" placeholder="Danh mục" className="input" value={newService.category} onChange={(e) => setNewService({ ...newService, category: e.target.value })} required />
        <input type="text" placeholder="Tên" className="input" value={newService.name} onChange={(e) => setNewService({ ...newService, name: e.target.value })} required />
        <input type="number" placeholder="Giá" className="input" value={newService.price} onChange={(e) => setNewService({ ...newService, price: e.target.value })} required />
        <input type="text" placeholder="Tốc độ" className="input" value={newService.speed} onChange={(e) => setNewService({ ...newService, speed: e.target.value })} required />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded-lg">{editService ? "Cập Nhật Dịch Vụ" : "Thêm Dịch Vụ"}</button>
      </form>
      <table className="w-full bg-gray-800 text-white rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-700">
            <th className="p-3 text-left">Nền tảng</th>
            <th className="p-3 text-left">Danh mục</th>
            <th className="p-3 text-left">Tên</th>
            <th className="p-3 text-left">Giá</th>
            <th className="p-3 text-left">Tốc độ</th>
            <th className="p-3 text-left">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {services.map((service) => (
            <tr key={service._id} className="border-b border-gray-700">
              <td className="p-3">{service.platform}</td>
              <td className="p-3">{service.category}</td>
              <td className="p-3">{service.name}</td>
              <td className="p-3">{service.price}</td>
              <td className="p-3">{service.speed}</td>
              <td className="p-3 flex gap-2">
                <button onClick={() => handleEditService(service)} className="bg-yellow-500 p-2 rounded-lg hover:bg-yellow-600">
                  <FiEdit size={18} />
                </button>
                <button onClick={() => handleDeleteService(service._id)} className="bg-red-500 p-2 rounded-lg hover:bg-red-600">
                  <FiTrash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManagerService;
