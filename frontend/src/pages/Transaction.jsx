import React, { useState } from 'react';
import axios from 'axios';

const Transaction = () => {
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDeposit = async (e) => {
    e.preventDefault();

    if (!amount || amount <= 0) {
      setMessage('Số tiền không hợp lệ');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('Bạn chưa đăng nhập');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        import.meta.env.VITE_BACKEND_URL + '/user/deposit',
        { amount },
        {
          headers: {
            token: token, // phù hợp với backend đang dùng req.headers.token
          },
        }
      );

      setMessage(response.data.message || 'Đã gửi yêu cầu');
    } catch (error) {
      setMessage('Lỗi máy chủ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 border rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Nạp tiền</h2>
      <form onSubmit={handleDeposit} className="space-y-4">
        <input
          type="number"
          min="1"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Nhập số tiền"
          className="w-full border px-3 py-2 rounded-md"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
        >
          {loading ? 'Đang xử lý...' : 'Gửi yêu cầu nạp tiền'}
        </button>
      </form>
      {message && (
        <p className={`mt-4 text-sm ${message.includes('lỗi') ? 'text-red-500' : 'text-green-500'}`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default Transaction;
