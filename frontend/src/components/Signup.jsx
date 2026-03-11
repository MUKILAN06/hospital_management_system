import React, { useState } from 'react';
import api from '../api';
import { useNavigate, Link } from 'react-router-dom';

function Signup() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'PATIENT',
        specialization: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            await api.post('/api/auth/signup', formData);
            setSuccess("Account created successfully! Redirecting to login...");
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.response?.data || 'Signup failed');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col justify-center items-center p-6">
            <div className="max-w-md w-full bg-white shadow-2xl rounded-3xl p-10">
                <h2 className="text-3xl font-extrabold text-blue-600 text-center mb-2">HospiFlow</h2>
                <h1 className="text-2xl font-bold text-gray-900 text-center mb-8">Create Account</h1>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm font-medium">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSignup} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                        <input
                            name="name"
                            required
                            className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Arun Kumar"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                        <input
                            name="email"
                            type="email"
                            required
                            className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="arun@gmail.com"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                            <input
                                name="password"
                                type="password"
                                required
                                className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Confirm</label>
                            <input
                                name="confirmPassword"
                                type="password"
                                required
                                className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="••••••••"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Role</label>
                        <select
                            name="role"
                            className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.role}
                            onChange={handleChange}
                        >
                            <option value="PATIENT">Patient</option>
                            <option value="DOCTOR">Doctor</option>
                        </select>
                    </div>

                    {formData.role === 'DOCTOR' && (
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Specialization</label>
                            <input
                                name="specialization"
                                required
                                className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="e.g. Cardiology"
                                value={formData.specialization}
                                onChange={handleChange}
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold text-lg shadow-lg hover:bg-blue-700 transition-all mt-4"
                    >
                        Create Account
                    </button>
                </form>

                <p className="mt-6 text-center text-gray-600">
                    Already have an account?{' '}
                    <Link to="/login" className="text-blue-600 font-bold hover:underline">
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Signup;
