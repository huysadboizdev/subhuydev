import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DepositRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const res = await axios.get(import.meta.env.VITE_BACKEND_URL + '/admin/transactions');
      if (res.data.success) {
        setRequests(res.data.transactions);
      } else {
        setRequests([]);
      }
    } catch (error) {
      console.error('Lỗi khi tải danh sách:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (transactionId) => {
    try {
      const res = await axios.post(import.meta.env.VITE_BACKEND_URL + '/admin/approve', { transactionId });
      if (res.data.success) {
        alert('Nạp tiền thành công');
        fetchRequests();
      } else {
        alert(res.data.message);
      }
    } catch (error) {
      console.error('Lỗi khi đồng ý nạp tiền:', error);
    }
  };

  const handleReject = async (transactionId) => {
    try {
      const res = await axios.post(import.meta.env.VITE_BACKEND_URL + '/admin/reject', { transactionId });
      if (res.data.success) {
        alert('Giao dịch đã bị từ chối');
        fetchRequests();
      } else {
        alert(res.data.message);
      }
    } catch (error) {
      console.error('Lỗi khi hủy bỏ nạp tiền:', error);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const formatDate = (date) => new Date(date).toLocaleString();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white/60 backdrop-blur-md rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">Yêu cầu nạp tiền</h2>
        {loading ? (
          <p className="text-center">Đang tải...</p>
        ) : requests.length === 0 ? (
          <p className="text-center">Không có yêu cầu nạp tiền nào.</p>
        ) : (
          <div className="space-y-4">
            {requests.map((req) => (
              <div key={req._id} className="bg-white/70 rounded-xl p-4 shadow-md border">
                <p><strong>Người dùng:</strong> {req.userId.username} ({req.userId.email})</p>
                <p><strong>Số tiền:</strong> {req.amount.toLocaleString()} đ</p>
                <p><strong>Trạng thái:</strong> {req.status}</p>
                <p><strong>Thời gian:</strong> {formatDate(req.createdAt)}</p>
                {req.status === 'pending' && (
                  <div className="mt-4 flex space-x-4 justify-center">
                    <button
                      onClick={() => handleApprove(req._id)}
                      className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600"
                    >
                      Đồng ý
                    </button>
                    <button
                      onClick={() => handleReject(req._id)}
                      className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"
                    >
                      Hủy bỏ
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DepositRequests;
