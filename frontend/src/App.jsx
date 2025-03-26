import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../src/pages/Home";
import Login from "../src/pages/Login";
import Home1 from "../src/pages/Home1";
import Order from "../src/pages/Order";
import Register from "../src/pages/Register";
import Logout from "./pages/Logout";



const App = () => {
  return (
    <div className='px-4 sm:px-[5vw] md:px - [7vw] lg:px-[10vw] overflow-auto'> 
    <Routes>
      <Route  path="/" element={<Home/>} />
      <Route  path="/login" element={<Login/>} />
      <Route  path="/register" element={<Register/>} />
      <Route  path="/order" element={<Order/>} />
      <Route  path="/home1" element={<Home1/>} />
      <Route  path="/logout" element={<Logout/>} />

    </Routes>
    </div>
  );
};

export default App;

