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
      const response = await axios.get(import.meta.env.VITE_BACKEND_URL + "/user/services");
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
      const totalPrice = service.price * quantity;

      const orderData = {
        userId: "your-user-id", // Replace with actual user ID
        serviceId: service._id, // The service ID from your selected service
        quantity,
      };

      const response = await axios.post(import.meta.env.VITE_BACKEND_URL + "/user/order", orderData);
      alert("Order created successfully!");
    } catch (error) {
      console.error("Error creating order:", error);
      alert("There was an error creating the order.");
    }
  };

  return (
    <div className="h-screen flex justify-center items-center">
      <div className="p-16 text-white rounded-lg shadow-md w-full max-w-3xl">
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
            value={price * (quantity ? parseInt(quantity) : 0) + " VND"}
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
    </div>
  );
};

export default Order;
