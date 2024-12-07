"use client";

import React, { useState } from 'react';

interface AppointmentForm {
    date: string;
    time: string;
    doctor: string;
    reason: string;
    hospital: string;
}

export default function AppointmentBooking() {
    const [formData, setFormData] = useState<AppointmentForm>({
        date: '',
        time: '',
        doctor: '',
        reason: '',
        hospital: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const doctors = [
        { id: 1, name: "Dr. Smith", specialty: "General Practitioner", availability: "Mon-Fri" },
        { id: 2, name: "Dr. Johnson", specialty: "Respiratory Specialist", availability: "Tue-Thu" },
        { id: 3, name: "Dr. Lee", specialty: "Physiotherapist", availability: "Mon-Wed" },
        { id: 4, name: "Dr. Wong", specialty: "General Practitioner", availability: "Wed-Fri" }
    ];

    const hospitals = [
        { id: 1, name: "Penang General Hospital", address: "Jalan Residensi, George Town", phone: "04-222 5333" },
        { id: 2, name: "Lam Wah Ee Hospital", address: "Jalan Tan Sri Teh Ewe Lim", phone: "04-657 1888" },
        { id: 3, name: "Gleneagles Medical Centre", address: "1, Jalan Pangkor", phone: "04-222 9111" },
        { id: 4, name: "Island Hospital", address: "308, Macalister Road", phone: "04-228 8222" }
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const response = await fetch('/api/health/appointment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    id: Date.now(),
                    status: 'pending',
                    createdat: new Date().toISOString()
                }),
            });

            const data = await response.json();

            if (response.ok) {
                if (data.error) {
                    throw new Error(data.error);
                }
                setSubmitSuccess(true);
                setTimeout(() => {
                    window.location.href = '/health/view';
                }, 2000);
            } else {
                throw new Error(data.error || 'Failed to schedule appointment');
            }
        } catch (error) {
            console.error('Error scheduling appointment:', error);
            alert('Failed to schedule appointment. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const validateDate = (selectedDate: string) => {
        const today = new Date().toISOString().split('T')[0];
        return selectedDate >= today;
    };

    return (
        <div className="min-w-full min-h-screen p-6 bg-[#F4F7FE]">
            <h1 className="text-3xl font-bold text-center text-[#2E3976] mb-8">Schedule Medical Appointment</h1>

            {submitSuccess && (
                <div className="fixed top-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg">
                    Appointment scheduled successfully! Redirecting...
                </div>
            )}

            <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="form-group">
                            <label className="text-gray-700 mb-2">
                                Date
                            </label>
                            <input
                                type="date"
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#2E3976]"
                                value={formData.date}
                                onChange={(e) => setFormData({...formData, date: e.target.value})}
                                min={new Date().toISOString().split('T')[0]}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="text-gray-700 mb-2">
                                Time
                            </label>
                            <input
                                type="time"
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#2E3976]"
                                value={formData.time}
                                onChange={(e) => setFormData({...formData, time: e.target.value})}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="text-gray-700 mb-2">
                            Hospital
                        </label>
                        <select
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#2E3976]"
                            value={formData.hospital}
                            onChange={(e) => setFormData({...formData, hospital: e.target.value})}
                            required
                        >
                            <option value="">Select a hospital</option>
                            {hospitals.map((hospital) => (
                                <option key={hospital.id} value={hospital.name}>
                                    {hospital.name} - {hospital.address}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="text-gray-700 mb-2">
                            Doctor
                        </label>
                        <select
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#2E3976]"
                            value={formData.doctor}
                            onChange={(e) => setFormData({...formData, doctor: e.target.value})}
                            required
                        >
                            <option value="">Select a doctor</option>
                            {doctors.map((doctor) => (
                                <option key={doctor.id} value={doctor.name}>
                                    {doctor.name} - {doctor.specialty} ({doctor.availability})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="text-gray-700 mb-2">
                            Reason for Visit
                        </label>
                        <textarea
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#2E3976] min-h-[100px]"
                            value={formData.reason}
                            onChange={(e) => setFormData({...formData, reason: e.target.value})}
                            required
                            placeholder="Please describe your symptoms or reason for the appointment"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full bg-[#2E3976] text-white py-3 px-6 rounded-lg font-semibold
                            hover:bg-[#232d5c] transition duration-300 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {isSubmitting ? 'Scheduling...' : 'Schedule Appointment'}
                    </button>
                </form>
            </div>
        </div>
    );
}
