import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
import PatientDashboard from './components/PatientDashboard';
import DoctorDashboard from './components/DoctorDashboard';
import AdminDashboard from './components/AdminDashboard';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Signup from './components/Signup';
import axios from 'axios';

axios.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

function LandingPage() {
  const user = JSON.parse(localStorage.getItem('user'));
  
  if (user) {
    if (user.role === 'PATIENT') return <Navigate to="/patient" />;
    if (user.role === 'DOCTOR') return <Navigate to="/doctor" />;
    if (user.role === 'ADMIN') return <Navigate to="/admin" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col justify-center items-center">
      <div className="absolute top-0 left-0 w-full p-6 text-center">
        <h2 className="text-3xl font-extrabold text-blue-600 tracking-wide">HospiFlow</h2>
      </div>
      <div className="max-w-4xl bg-white shadow-2xl rounded-3xl p-12 text-center transform transition-all duration-500 hover:scale-[1.02]">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
          Next-Gen <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600">Health Management</span>
        </h1>
        <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          The all-in-one system for booking appointments, managing Doctor schedules, and analyzing hospital performance in real-time.
        </p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <Link to="/login" className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl font-semibold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-1 transition-all duration-300">
            Sign In
          </Link>
          <Link to="/signup" className="px-8 py-4 bg-white text-blue-600 border border-blue-200 rounded-2xl font-semibold shadow-md hover:bg-blue-50 hover:-translate-y-1 transition-all duration-300">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}

function ProtectedRoute({ children, role }) {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) return <Navigate to="/login" />;
  if (user.role !== role) {
    if (user.role === 'PATIENT') return <Navigate to="/patient" />;
    if (user.role === 'DOCTOR') return <Navigate to="/doctor" />;
    if (user.role === 'ADMIN') return <Navigate to="/admin" />;
    return <Navigate to="/" />;
  }
  return children;
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          <Route path="/patient" element={
            <ProtectedRoute role="PATIENT">
              <Navbar role="Patient" />
              <PatientDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/doctor" element={
            <ProtectedRoute role="DOCTOR">
              <Navbar role="Doctor" />
              <DoctorDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/admin" element={
            <ProtectedRoute role="ADMIN">
              <Navbar role="Admin" />
              <AdminDashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
