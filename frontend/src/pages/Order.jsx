import React, { useState, useEffect } from "react";
import axios from "axios";

const Order = () => {
  const [serviceData, setServiceData] = useState({});
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState(0);
  const [orderHistory, setOrderHistory] = useState([]);

  useEffect(() => {
    fetchServices();
    fetchOrderHistory();
  }, []);

  const fetchServices = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/user/order",
        { action: "getServices" },
        { headers: { token } }
      );
      const services = response.data.services;

      const organized = {};

      services.forEach(service => {
        if (!organized[service.platform]) {
          organized[service.platform] = {
            categories: [],
            services: {}
          };
        }

        if (!organized[service.platform].categories.includes(service.category)) {
          organized[service.platform].categories.push(service.category);
          organized[service.platform].services[service.category] = [];
        }

        organized[service.platform].services[service.category].push(service);
      });

      setServiceData(organized);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  const fetchOrderHistory = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/user/order",
        { action: "getOrderHistory" },
        { headers: { token } }
      );

      setOrderHistory(response.data.orders);
    } catch (error) {
      console.error("Error fetching order history:", error);
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

  const handleSubmit = async () => {
    if (!selectedPlatform || !selectedCategory || !selectedService || !quantity || quantity <= 0) {
      alert("Please select all fields and enter a valid quantity.");
      return;
    }

    try {
      const service = services.find((s) => s.name === selectedService);
      const token = localStorage.getItem("token");

      const orderData = {
        action: "createOrder",
        serviceId: service._id,
        quantity,
      };

      const response = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/user/order",
        orderData,
        { headers: { token } }
      );

      alert("Order created successfully!");
      fetchOrderHistory();
      setQuantity("");
    } catch (error) {
      console.error("Error creating order:", error);
      alert("There was an error creating the order.");
    }
  };

  return (
    <div className="min-h-screen text-white px-4 py-8">
      {/* Order Creation Table */}
      <div className="p-8 rounded-lg shadow-md w-full max-w-3xl mx-auto bg-gray-800 mb-8">
        <h2 className="text-2xl font-bold mb-5 text-left">Create New Order</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Select Platform */}
          <select
            className="p-4 bg-gray-700 text-white rounded-xl w-full text-lg"
            onChange={(e) => setSelectedPlatform(e.target.value)}
          >
            <option value="">Select Platform</option>
            {Object.keys(serviceData).map((platform) => (
              <option key={platform} value={platform}>{platform}</option>
            ))}
          </select>

          {/* Select Category */}
          <select
            className="p-4 bg-gray-700 text-white rounded-xl w-full text-lg"
            onChange={(e) => setSelectedCategory(e.target.value)}
            disabled={!selectedPlatform}
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          {/* Select Service */}
          <select
            className="p-4 bg-gray-700 text-white rounded-xl w-full text-lg col-span-full"
            onChange={handleServiceChange}
            disabled={!selectedCategory}
          >
            <option value="">Select Service</option>
            {services.map((service) => (
              <option key={service.name} value={service.name}>{service.name}</option>
            ))}
          </select>

          {/* Enter Quantity */}
          <input
            className="p-4 bg-gray-700 text-white rounded-xl w-full text-lg"
            placeholder="Enter Quantity"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />

          {/* Display Total Price */}
          <input
            className="p-4 bg-gray-700 text-white rounded-xl w-full text-lg"
            placeholder="Total Price"
            type="text"
            value={(
              price * (quantity ? parseInt(quantity) : 0)
            ).toLocaleString("vi-VN") + " VND"}
            readOnly
          />
        </div>

        {/* Submit Order */}
        <button
          className="mt-6 bg-purple-500 hover:bg-purple-600 p-4 text-lg rounded-xl text-white w-full"
          onClick={handleSubmit}
        >
          Confirm Order
        </button>
      </div>

      {/* Order History Table */}
      <div className="p-8 rounded-lg shadow-md w-full max-w-3xl mx-auto bg-gray-800">
        <h2 className="text-xl font-semibold mt-10 mb-4 text-white text-left">Order History</h2>
        <div className="space-y-4">
          {orderHistory.length === 0 ? (
            <p className="text-gray-300">No orders yet.</p>
          ) : (
            orderHistory.map((order) => (
              <div
                key={order._id}
                className="p-4 bg-gray-700 rounded-lg flex justify-between items-center"
              >
                <div>
                  <p className="text-white font-bold">{order.service.name}</p>
                  <p className="text-gray-400 text-sm">Platform: {order.service.platform}</p>
                  <p className="text-gray-400 text-sm">Category: {order.service.category}</p>
                  <p className="text-gray-400 text-sm">Quantity: {order.quantity}</p>
                  <p className="text-gray-400 text-sm">
                    Total: {order.totalPrice.toLocaleString("vi-VN")} VND
                  </p>
                </div>
                <span
                  className={`px-4 py-1 rounded-full text-sm font-semibold ${order.status === "Pending"
                    ? "bg-yellow-500"
                    : order.status === "Completed"
                    ? "bg-green-500"
                    : "bg-gray-500"
                  }`}
                >
                  {order.status}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Order;
