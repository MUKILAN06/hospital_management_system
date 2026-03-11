import React, { useState } from 'react';
import api from '../api';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/api/auth/login', { email, password });
            localStorage.setItem('user', JSON.stringify(res.data));
            
            const role = res.data.role;
            if (role === 'PATIENT') navigate('/patient');
            else if (role === 'DOCTOR') navigate('/doctor');
            else if (role === 'ADMIN') navigate('/admin');
        } catch (err) {
            setError(err.response?.data || 'Login failed');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col justify-center items-center p-6">
            <div className="max-w-md w-full bg-white shadow-2xl rounded-3xl p-10 transform transition-all duration-500 hover:scale-[1.01]">
                <h2 className="text-3xl font-extrabold text-blue-600 text-center mb-2">HospiFlow</h2>
                <h1 className="text-2xl font-bold text-gray-900 text-center mb-8">Welcome Back</h1>
                
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                        <input
                            type="email"
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            placeholder="arun@gmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                        <input
                            type="password"
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-lg shadow-lg hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl transition-all"
                    >
                        Sign In
                    </button>
                </form>

                <p className="mt-8 text-center text-gray-600">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-blue-600 font-bold hover:underline">
                        Create Account
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Login;
