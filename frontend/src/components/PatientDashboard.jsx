import React, { useState, useEffect } from 'react';
import api from '../api';

function PatientDashboard() {
    const [doctors, setDoctors] = useState([]);
    const [search, setSearch] = useState('');
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [message, setMessage] = useState('');

    const user = JSON.parse(localStorage.getItem('user'));
    const patientId = user?.id;

    useEffect(() => {
        if (!user || user.role !== 'PATIENT') {
            setMessage({ text: 'Only patients can book appointments', type: 'error' });
            return;
        }
        api.get('/api/users/doctors')
            .then(res => setDoctors(res.data))
            .catch(err => console.error(err));
    }, []);

    const handleBook = () => {
        if (!selectedDoctor || !date || !time) return;

        // Convert HH:mm to HH:mm:ss if needed or just pass HH:mm
        const startTime = time;
        // Assuming 30 mins slot
        const end = new Date(`1970-01-01T${time}`);
        end.setMinutes(end.getMinutes() + 30);
        const endTime = end.toTimeString().substring(0, 5); // get HH:mm

        const request = {
            patientId,
            doctorId: selectedDoctor.id,
            appointmentDate: date,
            startTime: startTime + ':00',
            endTime: endTime + ':00'
        };

        api.post('/api/appointments/book', request)
            .then(res => {
                setMessage({ text: 'Appointment Booked Successfully!', type: 'success' });
                setTimeout(() => setMessage(''), 3000);
            })
            .catch(err => {
                setMessage({ text: err.response?.data || 'Error booking appointment', type: 'error' });
            });
    };

    const filteredDoctors = doctors.filter(doc =>
        doc.name.toLowerCase().includes(search.toLowerCase()) ||
        (doc.specialization && doc.specialization.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-8 border-b pb-4">Book an Appointment</h1>

            {message && (
                <div className={`mb-6 p-4 rounded-xl shadow-sm border ${message.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                    <div className="flex font-semibold text-lg">{message.text}</div>
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-8 transition-all relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-blue-500"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Search Doctor / Specialization</label>
                        <input
                            type="text"
                            placeholder="e.g. Cardiologist"
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-shadow shadow-sm"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Select Date</label>
                        <input
                            type="date"
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-shadow shadow-sm bg-gray-50"
                            value={date}
                            onChange={e => setDate(e.target.value)}
                        />
                    </div>

                    {selectedDoctor && (
                        <div className="md:col-span-2 bg-blue-50 rounded-xl p-4 border border-blue-100 flex items-center justify-between">
                            <div>
                                <p className="font-semibold text-blue-900">Selected: {selectedDoctor.name}</p>
                                <p className="text-sm text-blue-700">{selectedDoctor.specialization}</p>
                            </div>
                            <button onClick={() => setSelectedDoctor(null)} className="text-blue-500 hover:text-blue-700 text-sm font-medium">Clear</button>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Select Time</label>
                        <input
                            type="time"
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-shadow shadow-sm"
                            value={time}
                            onChange={e => setTime(e.target.value)}
                        />
                    </div>

                    <div className="flex items-end">
                        <button
                            onClick={handleBook}
                            disabled={!selectedDoctor || !date || !time}
                            className={`w-full py-4 text-white rounded-xl shadow-lg font-bold text-lg transition-all ${(!selectedDoctor || !date || !time) ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl hover:-translate-y-0.5'}`}
                        >
                            Confirm Booking
                        </button>
                    </div>
                </div>
            </div>

            <h2 className="text-xl font-bold text-gray-900 mb-6">Available Doctors</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDoctors.map(doc => (
                    <div
                        key={doc.id}
                        onClick={() => setSelectedDoctor(doc)}
                        className={`cursor-pointer rounded-2xl p-6 border-2 transition-all duration-300 ${selectedDoctor?.id === doc.id ? 'border-blue-500 bg-blue-50 shadow-md transform scale-105' : 'border-gray-100 bg-white hover:border-gray-300 hover:shadow-lg'}`}
                    >
                        <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xl mb-4">
                            {doc.name.charAt(0)}{doc.name.charAt(1) === 'r' ? doc.name.charAt(3) : doc.name.charAt(1)}
                        </div>
                        <h3 className="font-bold text-lg text-gray-900">{doc.name}</h3>
                        <p className="text-blue-600 font-medium text-sm mb-4 bg-blue-50 inline-block px-2 py-1 rounded-md mt-1">{doc.specialization}</p>

                        <div className="pt-4 border-t border-gray-100/60 mt-2">
                            <p className="text-xs text-gray-500 font-semibold mb-2">AVAILABLE SLOTS</p>
                            {doc.availableSlots?.length > 0 ? (
                                <ul className="space-y-1">
                                    {doc.availableSlots.map((slot, idx) => (
                                        <li key={idx} className="text-sm text-gray-700 bg-gray-50 px-2 py-1 flex justify-between rounded items-center">
                                            <span>{slot.date}</span>
                                            <span className="font-mono text-xs bg-white px-1 shadow-sm rounded border">{slot.startTime.substring(0, 5)} - {slot.endTime.substring(0, 5)}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-xs text-gray-400 italic">No available slots added</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default PatientDashboard;
