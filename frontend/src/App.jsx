import React from 'react'
import { Navigate, Route, Routes } from "react-router";
//import { BrowserRouter, Route } from 'react-router-dom';
import ChatePage from './pages/ChatePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import './App.css';
import { useAuthStore } from './store/useAuthStore.js';
import { useEffect } from "react";
import PageLoader from './components/PageLoader.jsx';
import { Toaster } from "react-hot-toast";

function App() {
  const { checkAuth, isCheckingAuth, authUser } = useAuthStore();

  useEffect(() => {
    checkAuth()
  }, [checkAuth]);

  console.log({ authUser });

  if(isCheckingAuth) return <PageLoader/>
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

        <Routes>
          <Route path="/" element={authUser ? <ChatePage /> : <Navigate to={"/login"} />} />
          <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to={"/"} />} />
          <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to={"/"} />} />
        </Routes>
        <Toaster
        position='top-right'
        />
      </div>
    </div>

  )
}

export default App