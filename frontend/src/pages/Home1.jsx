import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FiShoppingCart, FiList, FiClock,  FiMenu, FiX, FiLogOut, FiInfo } from "react-icons/fi";
import Transaction from "./Transaction";

const Home1 = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Trang Chủ");
  const [showTransaction, setShowTransaction] = useState(false);


  return (
    <div className="flex h-screen">
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-gray-800 text-white p-2 rounded-lg"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-gray-900 p-5 transform transition-transform md:translate-x-0 ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="text-white text-lg font-bold mb-6 text-center">Dịch Vụ</div>
        <nav>
          <ul className="space-y-3">


            <li
              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer 
                  ${activeTab === "Đặt hàng" ? "bg-gray-700 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"}`}
              onClick={() => setActiveTab("Đặt hàng")}
            >
              <Link to="/order" className="flex items-center gap-3 w-full">
                <FiShoppingCart /> Đặt hàng
              </Link>
            </li>

            <li
              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer 
  ${activeTab === "Thông Tin" ? "bg-gray-700 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"}`}
              onClick={() => setActiveTab("Thông Tin")}
            >
              <Link to="/profile" className="flex items-center gap-3 w-full">
                <FiInfo /> Thông Tin
              </Link>
            </li>

            <li
              className="flex items-center gap-3 p-3 text-white bg-green-500 rounded-lg shadow-md hover:bg-green-600 cursor-pointer"
            >
              <Link to="/login" className="flex items-center gap-3 w-full">
                <FiLogOut /> Đăng Xuất
              </Link>
            </li>


          </ul>
        </nav>
      </aside>
      <div className={`p-0 w-full transition-all ${menuOpen ? "ml-0" : "md:ml-64"}`}>
        <div className="mt-20 w-full max-w-10xl mx-auto">
          <div className="p-5 bg-gray-900 text-white rounded-lg shadow-md mb-9">
            <p>Chào Mừng <span className="text-red-500 font-bold"></span> Bạn Quay Trở Lại !</p>
            <p>
              Đang KM 20% Giá Trị Nạp Tiền, Ae tranh thủ húp nhé !
              <button
                className="p-2 bg-yellow-400 text-black font-bold rounded-lg ml-2"
                onClick={() => setShowTransaction(true)}
              >
                Nạp tiền ngay
              </button>

            </p>

            <p>Cần Hỗ Trợ Thì
              <button
                className="p-2 bg-yellow-400 text-black font-bold rounded-lg ml-2"
                onClick={() => window.open("https://zalo.me/84763076124", "_blank")}
              >
                Liên hệ Admin Qua ZALO
              </button>
              Hoặc
              <button
                className="p-2 bg-blue-400 text-red-600 font-bold rounded-lg ml-2"
                onClick={() => window.open("https://t.me/huydev204", "_blank")}
              >
                Liên hệ Admin Qua TELEGRAM
              </button>
            </p>
            <p>Nhóm Zalo Trao Đổi - Thông Báo
              <button
                className="p-2 bg-green-500 text-white font-bold rounded-lg ml-2"
                onClick={() => window.open("https://zalo.me/g/sfejxv466", "_blank")}
              >
                Click Vào Nhóm Zalo
              </button>
            </p>

          </div>

          {showTransaction && (
            <div className="p-5 bg-gray-900 text-black rounded-lg shadow-md mt-6">
              <Transaction />
              <button
                className="mt-4 p-2 bg-red-500 text-black font-bold rounded-lg"
                onClick={() => setShowTransaction(false)}
              >
                Đóng
              </button>
            </div>
          )}


        </div>
      </div>
    </div>
  );
};

export default Home1;
