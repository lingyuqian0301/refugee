"use client";

import React, { useState, useEffect } from 'react';

interface ImmunizationForm {
    name: string;
    date: string;
}

export default function ImmunizationForm() {
    const [formData, setFormData] = useState<ImmunizationForm>({
        name: '',
        date: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const [immunizations, setImmunizations] = useState<ImmunizationRecord[]>([]);

    useEffect(() => {
        const fetchImmunizations = async () => {
            try {
                const response = await fetch('/api/immunizations');
                if (response.ok) {
                    const data = await response.json();
                    setImmunizations(data);
                }
            } catch (error) {
                console.error('Error fetching immunizations:', error);
            }
        };

        fetchImmunizations();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch('/api/immunizations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setSubmitSuccess(true);
                setTimeout(() => {
                    window.location.href = '/health/view';
                }, 2000);
            } else {
                throw new Error('Failed to add immunization record');
            }
        } catch (error) {
            console.error('Error adding immunization record:', error);
            alert('Failed to add immunization record. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-w-full min-h-screen p-6 bg-[#F4F7FE]">
            <h1 className="text-3xl font-bold text-center text-[#2E3976] mb-8">Add Immunization Record</h1>

            {submitSuccess && (
                <div className="fixed top-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg">
                    Immunization record added successfully! Redirecting...
                </div>
            )}

            <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="form-group">
                        <label className="text-gray-700 mb-2">
                            Immunization Name
                        </label>
                        <input
                            type="text"
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#2E3976]"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            required
                            placeholder="Enter immunization name"
                        />
                    </div>

                    <div className="form-group">
                        <label className="text-gray-700 mb-2">
                            Date
                        </label>
                        <input
                            type="date"
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#2E3976]"
                            value={formData.date}
                            onChange={(e) => setFormData({...formData, date: e.target.value})}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full bg-[#2E3976] text-white py-3 px-6 rounded-lg font-semibold
                            hover:bg-[#232d5c] transition duration-300 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {isSubmitting ? 'Adding...' : 'Add Immunization Record'}
                    </button>
                </form>
            </div>
        </div>
    );
}