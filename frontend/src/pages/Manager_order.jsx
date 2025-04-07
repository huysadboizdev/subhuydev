import React, { useState, useEffect } from "react";
import axios from "axios";

const ManagerOrder = () => {
  const [orders, setOrders] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [orderIdToDelete, setOrderIdToDelete] = useState(null);

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const fetchAllOrders = async () => {
    try {
      const response = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/admin/manage-order",
        { action: "getAllOrders" },
        { headers: { token: localStorage.getItem("token") } }
      );
      setOrders(response.data.orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const handleUpdateOrderStatus = async (orderId) => {
    if (!selectedStatus) {
      alert("Please select a status.");
      return;
    }

    try {
      const response = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/admin/manage-order",
        {
          action: "updateOrderStatus",
          orderId,
          status: selectedStatus,
        },
        { headers: { token: localStorage.getItem("token") } }
      );
      alert(response.data.message);
      fetchAllOrders(); // Refresh the order list after update
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("There was an error updating the order status.");
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        const response = await axios.post(
          import.meta.env.VITE_BACKEND_URL + "/admin/manage-order",
          {
            action: "deleteOrder",
            orderId,
          },
          { headers: { token: localStorage.getItem("token") } }
        );
        alert(response.data.message);
        fetchAllOrders(); // Refresh the order list after deletion
      } catch (error) {
        console.error("Error deleting order:", error);
        alert("There was an error deleting the order.");
      }
    }
  };

  return (
    <div className="min-h-screen text-white px-4 py-8">
      <div className="p-8 rounded-lg shadow-md w-full max-w-3xl mx-auto bg-gray-800 mb-8">
        <h2 className="text-2xl font-bold mb-5 text-left">Manage Orders</h2>

        <table className="min-w-full bg-gray-800">
          <thead>
            <tr className="text-left">
              {/* <th className="p-4">Order ID</th> */}
              <th className="p-4">Service Name</th>
              <th className="p-4">Status</th>
              <th className="p-4">Total Price</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                {/* <td className="p-4">{order._id}</td> */}
                <td className="p-4">{order.service.name}</td>
                <td className="p-4">
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="bg-gray-700 text-white rounded-xl p-2"
                  >
                    <option value="">Select Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                    <option value="Canceled">Canceled</option>
                  </select>
                </td>
                <td className="p-4">{order.totalPrice.toLocaleString("vi-VN")} VND</td>
                <td className="p-4">
                  <button
                    onClick={() => handleUpdateOrderStatus(order._id)}
                    className="bg-blue-500 hover:bg-blue-600 p-2 text-white rounded-xl"
                  >
                    Update Status
                  </button>
                  <button
                    onClick={() => handleDeleteOrder(order._id)}
                    className="bg-red-500 hover:bg-red-600 p-2 text-white rounded-xl ml-4"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManagerOrder;
