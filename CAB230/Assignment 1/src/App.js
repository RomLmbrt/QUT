import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom"

import Header from "./components/Header";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import VolcanoList from "./pages/VolcanoList";
import Volcano from "./pages/Volcano";

export default function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/VolcanoList" element={<VolcanoList />} />
          <Route path="/VolcanoList/Volcano" element={<Volcano />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}