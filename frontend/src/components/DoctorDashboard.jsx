import React, { useState, useEffect } from 'react';
import api from '../api';

function DoctorDashboard() {
    const [appointments, setAppointments] = useState([]);
    const [message, setMessage] = useState(null);
    const [newSlot, setNewSlot] = useState({ date: '', startTime: '', endTime: '' });

    const user = JSON.parse(localStorage.getItem('user'));
    const doctorId = user?.id;

    const fetchAppointments = () => {
        if (!doctorId) return;
        api.get(`/api/appointments/doctor/${doctorId}`)
            .then(res => setAppointments(res.data))
            .catch(err => console.error(err));
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    const handleConfirm = (id) => {
        api.put(`/api/appointments/${id}/confirm?doctorId=${doctorId}`)
            .then(res => {
                setMessage({ text: 'Appointment Confirmed!', type: 'success' });
                fetchAppointments();
                setTimeout(() => setMessage(null), 3000);
            })
            .catch(err => {
                setMessage({ text: err.response?.data || 'Error confirming', type: 'error' });
            });
    };

    const handleComplete = (id) => {
        api.put(`/api/appointments/${id}/complete`)
            .then(res => {
                fetchAppointments();
            })
            .catch(err => {
                console.error(err);
            });
    };

    const handleAddSlot = (e) => {
        e.preventDefault();
        api.post(`/api/users/${doctorId}/slots`, newSlot)
            .then(res => {
                setMessage({ text: 'Slot Added Successfully!', type: 'success' });
                setNewSlot({ date: '', startTime: '', endTime: '' });
                setTimeout(() => setMessage(null), 3000);
            })
            .catch(err => {
                setMessage({ text: typeof err.response?.data === 'string' ? err.response.data : 'Error adding slot', type: 'error' });
                setTimeout(() => setMessage(null), 3000);
            });
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-extrabold text-gray-900">Doctor Dashboard</h1>
                <div className="text-sm bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full font-medium shadow-sm border border-indigo-100">
                    {user?.name || 'Doctor'}
                </div>
            </div>

            {message && (
                <div className={`mb-6 p-4 rounded-xl shadow-sm border ${message.type === 'success' ? 'bg-green-50 text-green-800 border-green-200' : 'bg-red-50 text-red-800 border-red-200'}`}>
                    {message.text}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                {/* Manage Availability */}
                <div className="md:col-span-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-fit">
                    <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                        <h2 className="text-xl font-bold text-gray-800">Add Availability</h2>
                    </div>
                    <form onSubmit={handleAddSlot} className="p-6 space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Date</label>
                            <input
                                type="date"
                                required
                                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                                value={newSlot.date}
                                onChange={e => setNewSlot({ ...newSlot, date: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Start Time</label>
                                <input
                                    type="time"
                                    required
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                                    value={newSlot.startTime}
                                    onChange={e => setNewSlot({ ...newSlot, startTime: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">End Time</label>
                                <input
                                    type="time"
                                    required
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                                    value={newSlot.endTime}
                                    onChange={e => setNewSlot({ ...newSlot, endTime: e.target.value })}
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm shadow-md transition-all mt-2"
                        >
                            Add Slots
                        </button>
                    </form>
                </div>

                {/* Appointments List */}
                <div className="md:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                        <h2 className="text-xl font-bold text-gray-800">Your Schedule</h2>
                    </div>
                <div className="divide-y divide-gray-100">
                    {appointments.length === 0 ? (
                        <div className="p-10 text-center text-gray-500">
                            No appointments scheduled yet.
                        </div>
                    ) : (
                        <ul className="divide-y divide-gray-100">
                            {appointments.map(apt => (
                                <li key={apt.id} className="p-6 flex flex-col sm:flex-row justify-between items-center hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-indigo-100 flex justify-center items-center font-bold text-indigo-600 text-lg">
                                            {apt.patient.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-lg font-bold text-gray-900">{apt.patient.name}</p>
                                            <div className="flex bg-gray-100 rounded px-2 py-1 mt-1 text-sm font-medium text-gray-600 gap-2 items-center w-fit">
                                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                                <span>{apt.appointmentDate}</span>
                                                <span className="text-gray-400">|</span>
                                                <span className="font-mono">{apt.startTime.substring(0, 5)} - {apt.endTime.substring(0, 5)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 items-center">
                                        <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider
                       ${apt.status === 'CONFIRMED' ? 'bg-indigo-100 text-indigo-700' :
                                                apt.status === 'BOOKED' ? 'bg-yellow-100 text-yellow-700' :
                                                    apt.status === 'CANCELLED' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}
                     `}>
                                            {apt.status}
                                        </span>

                                        {apt.status === 'BOOKED' && (
                                            <button
                                                onClick={() => handleConfirm(apt.id)}
                                                className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white text-sm font-bold rounded-xl shadow-md transition-all hover:-translate-y-0.5"
                                            >
                                                Confirm
                                            </button>
                                        )}

                                        {apt.status === 'CONFIRMED' && (
                                            <button
                                                onClick={() => handleComplete(apt.id)}
                                                className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white text-sm font-bold rounded-xl shadow-md transition-all hover:-translate-y-0.5"
                                            >
                                                Mark Completed
                                            </button>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                </div>
            </div>
        </div>
    );
}

export default DoctorDashboard;
