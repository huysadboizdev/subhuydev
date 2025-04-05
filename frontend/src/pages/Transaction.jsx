// src/pages/user/Transaction.jsx
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AppContext } from '../../context/AppContext';

const Transaction = () => {
  const { user } = useContext(AppContext);
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [transactions, setTransactions] = useState([]);
  

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await axios.get(`/api/transactions/${user._id}`);
        setTransactions(res.data.transactions);
      } catch (err) {
        console.error(err);
      }
    };
    if (user) fetchTransactions();
  }, [user]);

  const handleDeposit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/users/request-deposit', {
        userId: user._id,
        amount: Number(amount),
      });
      setMessage(res.data.message);
      setAmount('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 mt-10">
      <h1 className="text-2xl font-bold text-center">Yêu cầu nạp tiền</h1>
      <form onSubmit={handleDeposit} className="space-y-4">
        <div>
          <label className="block font-medium text-gray-700 mb-1">Số tiền:</label>
          <input
            type="number"
            className="w-full border border-gray-300 rounded px-4 py-2"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Gửi yêu cầu
        </button>
        {message && <p className="text-green-600 font-medium text-center">{message}</p>}
      </form>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Lịch sử giao dịch</h2>
        <div className="space-y-2">
          {transactions.map((t) => (
            <div key={t._id} className="border p-3 rounded shadow bg-white">
              <p><strong>Số tiền:</strong> {t.amount.toLocaleString('vi-VN')} đ</p>
              <p><strong>Trạng thái:</strong> {t.status}</p>
              <p><strong>Ngày:</strong> {new Date(t.createdAt).toLocaleString('vi-VN')}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Transaction;
