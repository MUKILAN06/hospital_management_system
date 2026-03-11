import React, { useState, useEffect } from 'react';
import api from '../api';

function AdminDashboard() {
    const [reports, setReports] = useState({ appointments: [], revenue: [] });
    const [appointments, setAppointments] = useState([]);
    const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'DOCTOR', specialization: '' });
    const [msg, setMsg] = useState(null);

    const user = JSON.parse(localStorage.getItem('user'));
    const adminId = user?.id;

    const fetchAdminData = () => {
        api.get('/api/admin/reports/appointments-per-doctor')
            .then(res => setReports(prev => ({ ...prev, appointments: res.data })))
            .catch(err => console.error(err));
        api.get('/api/admin/reports/revenue-per-department')
            .then(res => setReports(prev => ({ ...prev, revenue: res.data })))
            .catch(err => console.error(err));
        api.get('/api/appointments')
            .then(res => setAppointments(res.data))
            .catch(err => console.error(err));
    };

    useEffect(() => {
        fetchAdminData();
    }, []);

    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            await api.post('/api/auth/signup', newUser);
            setMsg({ text: 'User created successfully', type: 'success' });
            setNewUser({ name: '', email: '', password: '', role: 'DOCTOR', specialization: '' });
            setTimeout(() => setMsg(null), 3000);
        } catch (err) {
            setMsg({ text: err.response?.data || 'Error creating user', type: 'error' });
        }
    };

    const handleCancel = (id) => {
        api.put(`/api/appointments/${id}/cancel?userId=${adminId}`)
            .then(res => {
                fetchAdminData();
            })
            .catch(err => {
                console.error(err);
            });
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full font-sans">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-8 border-b pb-4">Hospital Admin Portal</h1>

            {msg && (
                <div className={`mb-6 p-4 rounded-xl border ${msg.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                    {msg.text}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Appointments Report */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full -z-10 opacity-50"></div>
                        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                            </div>
                            Apts Per Doctor
                        </h2>
                        <div className="space-y-4">
                            {reports.appointments.map((r, i) => (
                                <div key={i} className="flex justify-between items-center bg-gray-50 px-4 py-3 rounded-xl border border-gray-100">
                                    <span className="font-semibold text-gray-700">{r.doctorName}</span>
                                    <span className="font-mono bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-bold shadow-inner">
                                        {r.totalAppointments} apts
                                    </span>
                                </div>
                            ))}
                            {reports.appointments.length === 0 && <span className="text-sm text-gray-400 italic">No appointments booked today.</span>}
                        </div>
                    </div>

                    {/* Revenue Report */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-bl-full -z-10 opacity-50"></div>
                        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                $
                            </div>
                            Revenue / Dept
                        </h2>
                        <div className="space-y-4">
                            {reports.revenue.map((r, i) => (
                                <div key={i} className="flex justify-between items-center bg-gray-50 px-4 py-3 rounded-xl border border-gray-100">
                                    <span className="font-semibold text-gray-700">{r.department}</span>
                                    <span className="font-mono bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold shadow-inner border border-green-200">
                                        ₹{r.revenue}
                                    </span>
                                </div>
                            ))}
                            {reports.revenue.length === 0 && <span className="text-sm text-gray-400 italic">No revenue from completed appointments yet.</span>}
                        </div>
                    </div>
                </div>

                {/* Manage Staff Form */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit">
                    <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                            +
                        </div>
                        Manage Staff
                    </h2>
                    <form onSubmit={handleCreateUser} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Full Name</label>
                            <input
                                required
                                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                value={newUser.name}
                                onChange={e => setNewUser({...newUser, name: e.target.value})}
                                placeholder="Dr. Alice Smith"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email</label>
                            <input
                                type="email"
                                required
                                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                value={newUser.email}
                                onChange={e => setNewUser({...newUser, email: e.target.value})}
                                placeholder="alice@hospital.com"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Password</label>
                            <input
                                type="password"
                                required
                                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                value={newUser.password}
                                onChange={e => setNewUser({...newUser, password: e.target.value})}
                                placeholder="••••••••"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Role</label>
                            <select
                                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                value={newUser.role}
                                onChange={e => setNewUser({...newUser, role: e.target.value})}
                            >
                                <option value="DOCTOR">Doctor</option>
                                <option value="ADMIN">Admin</option>
                            </select>
                        </div>
                        {newUser.role === 'DOCTOR' && (
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Specialization</label>
                                <input
                                    required
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                    value={newUser.specialization}
                                    onChange={e => setNewUser({...newUser, specialization: e.target.value})}
                                    placeholder="e.g. Cardiology"
                                />
                            </div>
                        )}
                        <button
                            type="submit"
                            className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-md hover:bg-blue-700 transition-all mt-2"
                        >
                            Create Account
                        </button>
                    </form>
                </div>
            </div>

            {/* Appointments List */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h2 className="text-xl font-bold text-gray-800">All Appointments List</h2>
                    <div className="text-xs font-mono bg-indigo-100 text-indigo-700 px-3 py-1 rounded border border-indigo-200">
                        Total: {appointments.length}
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider">
                                <th className="p-4 rounded-tl-xl border-b border-gray-200">Patient</th>
                                <th className="p-4 border-b border-gray-200">Doctor</th>
                                <th className="p-4 border-b border-gray-200">Date & Time</th>
                                <th className="p-4 border-b border-gray-200">Status</th>
                                <th className="p-4 rounded-tr-xl border-b border-gray-200 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {appointments.map(apt => (
                                <tr key={apt.id} className="hover:bg-indigo-50/30 transition-colors">
                                    <td className="p-4">
                                        <div className="font-bold text-gray-900">{apt.patient.name}</div>
                                        <div className="text-xs font-mono text-gray-400">ID: {apt.patient.id}</div>
                                    </td>
                                    <td className="p-4">
                                        <div className="font-semibold text-gray-800">{apt.doctor.name}</div>
                                        <div className="text-xs text-indigo-500 font-medium">{apt.doctor.specialization}</div>
                                    </td>
                                    <td className="p-4">
                                        <div className="font-medium text-gray-700">{apt.appointmentDate}</div>
                                        <div className="font-mono text-xs text-gray-500 bg-gray-100 inline-block px-1 py-0.5 rounded shadow-inner mt-1">
                                            {apt.startTime.substring(0, 5)} - {apt.endTime.substring(0, 5)}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 inline-block rounded-full text-xs font-bold uppercase tracking-wider
                       ${apt.status === 'CONFIRMED' ? 'bg-indigo-100 text-indigo-700' :
                                                apt.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                                                    apt.status === 'CANCELLED' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                            {apt.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        {apt.status === 'CONFIRMED' && (
                                            <button
                                                onClick={() => handleCancel(apt.id)}
                                                className="px-4 py-2 bg-red-50 hover:bg-red-500 text-red-600 hover:text-white border border-red-200 font-bold rounded-lg text-xs shadow-sm transition-all"
                                            >
                                                Cancel
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {appointments.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-gray-500 italic">There are no appointments in the system.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
