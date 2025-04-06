import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../src/pages/Home";
import Login from "../src/pages/Login";
import Home1 from "../src/pages/Home1";
import Order from "../src/pages/Order";
import Register from "../src/pages/Register";
import Logout from "./pages/Logout";
import Login_admin from "./pages/Login_admin";
import Home_admin from "./pages/Home_admin";
import Manager_user from "./pages/manager_user";
import ManagerService from "./pages/Manager_service";
import Profile from "./pages/Profile";
import Transaction from "./pages/Transaction";
import ManagerCard from "./pages/Manager_card";
import ServicesList from "./components/List_service";



const App = () => {
  return (
    <div className='px-4 sm:px-[5vw] md:px - [7vw] lg:px-[10vw] overflow-auto'>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/order" element={<Order />} />
        <Route path="/home1" element={<Home1 />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/login_admin" element={<Login_admin />} />
        <Route path="/admin/home_admin" element={<Home_admin />} />
        <Route path="/admin/manager_user" element={<Manager_user />} />
        <Route path="/admin/services" element={<ManagerService />} />
        <Route path="/admin/manager_card" element={<ManagerCard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/transaction" element={<Transaction />} />
        <Route path="/services" element={<ServicesList />} />
        {/* Add more routes as needed */}
        


      </Routes>
    </div>
  );
};

export default App;

