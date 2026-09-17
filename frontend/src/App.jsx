import React from 'react'
import { Route, Routes } from "react-router";
//import { BrowserRouter, Route } from 'react-router-dom';
import ChatePage from './pages/ChatePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import './App.css';
import { useAuthStore } from './store/useAuthStore.js';

function App() {
  const { authUser ,isloggedIn,login} = useAuthStore();
  console.log("auth User", authUser);
  console.log("isloggedIn", isloggedIn);
  return (

    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 relative flex items-center justify-center p-4 overflow-hidden">

      {/* Background decorations */}
      <div className="chat-bg-snail pointer-events-none absolute inset-0">

        {/* Rain drops */}
        <div className="rain rain-1"></div>
        <div className="rain rain-2"></div>
        <div className="rain rain-3"></div>

        {/* Leaves */}
        <div className="leaf leaf-1"></div>
        <div className="leaf leaf-2"></div>

        {/* Snails */}
        <div className="snail snail-1"></div>
        <div className="snail snail-2"></div>

        {/* Glows */}
        <div className="glow glow-green"></div>
        <div className="glow glow-blue"></div>

      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <button onClick={login} className="bg-blue-500 text-white px-4 py-2 rounded">Login</button>
        <Routes>
          <Route path="/" element={<ChatePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
        </Routes>
      </div>
    </div>

  )
}

export default App