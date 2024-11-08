"use client";

import React from 'react';
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBriefcaseMedical, faSyringe,faPlus, faCalendarAlt, faRobot, faComments, faNewspaper, faAppleAlt  } from '@fortawesome/free-solid-svg-icons';
import '../health.css';
import { ImmunizationRecord, MedicalHistoryRecord } from '../../health/health_interface';

interface DietaryGuideline {
    id: number;
    advice: string;
}

export default function ViewHealthRecord() {
    const [healthRecord] = useState({
        refugeeID: "MM-2024-01-0001",
        gender: "Male",
        bloodType: "O+",
    });

    const [immunizations, setImmunizations] = useState<ImmunizationRecord[]>([]);

    const [medicalHistories] = useState<MedicalHistoryRecord[]>([
        {
            recordID: "MH0001",
            diagnosis: "Asthma",
            treatment: "Inhaler",
            date: "2020-01-15",
            note: "Requires regular check-ups",
        },
        {
            recordID: "MH0002",
            diagnosis: "Fractured Arm",
            treatment: "Surgery and Physiotherapy",
            date: "2019-07-05",
            note: "Full recovery expected.",
        },
    ]);

    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await fetch('/api/appointments');
                if (response.ok) {
                    const data = await response.json();
                    setAppointments(data);
                }
            } catch (error) {
                console.error('Error fetching appointments:', error);
            }
        };

        fetchAppointments();
    }, []);

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

    // Dummy AI-driven recommendations
    const [recommendations] = useState([
        {
            id: 1,
            color: 'red',
            advice: "Since you have a history of asthma, it is recommended to carry an inhaler at all times, especially during physical activities.",
        },
        {
            id: 2,
            color: 'orange',
            advice: "You are due for a follow-up on your Hepatitis B vaccination. Consider scheduling an appointment for a booster shot.",
        },
        {
            id: 3,
            color: 'green',
            advice: "Ensure regular physiotherapy exercises to maintain mobility after your arm fracture surgery.",
        },
    ]);

    const [news] = useState([
        {
            id: 1,
            title: "WHO Launches New Initiative for Refugee Health Services",
            summary: "Aiming to improve access to critical health services for refugees worldwide, the WHO announced...",
            link: "/news/WHO-refugee-health-initiative",
        },
        {
            id: 2,
            title: "Vaccination Campaign for Refugees Set to Start Next Month",
            summary: "A global vaccination drive is being launched next month to protect refugee communities from various infectious diseases...",
            link: "/news/vaccination-campaign",
        },
    ])

    const [dietaryGuidelines, setDietaryGuidelines] = useState<DietaryGuideline[]>([
        { id: 1, advice: "Eat a balanced diet with plenty of vegetables and fruits." },
        { id: 2, advice: "Limit intake of sugary drinks and processed foods." },
    ]);

    return (
        <div style={{ minWidth: "100%", minHeight: '100vh', padding: '20px', backgroundColor: '#F4F7FE' }}>

            <h1 style={{ textAlign: 'center' }} className="page-title">View Health Record</h1>

            <div className='health-content'>
                <div className='health-content-left'>
                    <div className='health-view-div'>
                        <h2 className="section-title">
                            <FontAwesomeIcon icon={faUser} size="lg" /> Personal Health Details
                        </h2>
                        <div className="form-input-div">
                            <label>Refugee ID: </label>
                            <p>{healthRecord.refugeeID}</p>
                        </div>
                        <div className="form-input-div">
                            <label>Gender: </label>
                            <p>{healthRecord.gender}</p>
                        </div>
                        <div className="form-input-div">
                            <label>Blood Type: </label>
                            <p>{healthRecord.bloodType}</p>
                        </div>
                    </div>

                    <div className='health-view-div'>
                        <h2 className="section-title">
                            <FontAwesomeIcon icon={faBriefcaseMedical} size="lg" /> Medical History {medicalHistories.length > 0 ? `(${medicalHistories.length})` : ""}
                        </h2>
                        {medicalHistories.length === 0 ? (
                            <p className="message-p">No medical history records available.</p>
                        ) : (medicalHistories.map((record, index) => (
                            <div key={index} style={{ marginBottom: '20px' }} className="div-box">
                                <div className="form-input-div">
                                    <label>Diagnosis: </label>
                                    <p>{record.diagnosis}</p>
                                </div>
                                <div className="form-input-div">
                                    <label>Treatment: </label>
                                    <p>{record.treatment}</p>
                                </div>
                                <div className="form-input-div">
                                    <label>Date: </label>
                                    <p>{record.date}</p>
                                </div>
                                <div className="form-input-div">
                                    <label>Note: </label>
                                    <p>{record.note}</p>
                                </div>
                            </div>
                        )))}
                    </div>

                    <div className='health-view-div'>
                        <h2 className="section-title">
                            <FontAwesomeIcon icon={faSyringe} size="lg" /> Immunization Records {immunizations.length > 0 ? `(${immunizations.length})` : ""}
                        </h2>
                        {immunizations.length === 0 ? (
                            <p className="message-p">No immunization records available.</p>
                        ) : (immunizations.map((record, index) => (
                            <div key={index} style={{ marginBottom: '20px' }} className="div-box">
                                <div className="form-input-div">
                                    <label>Name: </label>
                                    <p>{record.name}</p>
                                </div>
                                <div className="form-input-div">
                                    <label>Date: </label>
                                    <p>{record.date}</p>
                                </div>
                            </div>
                        )))}
                        <button className="section-bot-btn" onClick={() => window.open('/immunization', '_blank')}>
                        <FontAwesomeIcon icon={faPlus} /> Add Immunization Record
                        </button>
                    </div>
                </div>

                <div className='health-content-right'>
                    {/* Medical Appointments Section */}
                    <div className="recommendation-container">
                        <h2 className="section-title">
                            <FontAwesomeIcon icon={faCalendarAlt} size="lg" /> Upcoming Medical Appointments
                        </h2>
                        {appointments.length === 0 ? (
                            <p className="message-p">No upcoming appointments.</p>
                        ) : (
                            <table className="appointments-table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Reason</th>
                                        <th>Doctor</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {appointments.map((appointment) => (
                                        <tr key={appointment.id}>
                                            <td>{appointment.date}</td>
                                            <td>{appointment.reason}</td>
                                            <td>{appointment.doctor}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                        <button className="section-bot-btn" onClick={() => window.open('/appointment', '_blank')}>
                        <FontAwesomeIcon icon={faPlus} /> Make an appointment
                        </button>
                    </div>

                    {/* AI-Driven Healthcare Recommendations Section */}
                    <div className="recommendation-container">
                        <h2 className="section-title">
                            <FontAwesomeIcon icon={faRobot} size="lg" /> AI-Driven Healthcare Recommendations
                        </h2>
                        {recommendations.length === 0 ? (
                            <p className="message-p recommend-p">No recommendations available at this time.</p>
                        ) : (
                            recommendations.map((recommendation) => (
                                <div key={recommendation.id} className={"recommendation-item " + recommendation.color} >
                                    <p className="recommend-p">{recommendation.advice}</p>
                                </div>
                            ))
                        )}
                    </div>

                     {/* Dietary Guidelines Section */}
                     <div className="recommendation-container">
                        <h2 className="section-title">
                            <FontAwesomeIcon icon={faAppleAlt} size="lg" /> Dietary Guidelines
                        </h2>
                        {dietaryGuidelines.length === 0 ? (
                            <p className="message-p">No dietary guidelines available.</p>
                        ) : (
                            dietaryGuidelines.map((guideline) => (
                                <div key={guideline.id} className="dietary-item">
                                    <p><strong>Advice:</strong> {guideline.advice}</p>
                                </div>
                            ))
                        )}
                        <button className="section-bot-btn">
                            <FontAwesomeIcon icon={faPlus} /> Add Dietary Plan
                        </button>
                    </div>

                    {/* Latest Healthcare News for Refugees Section */}
                    <div className="recommendation-container news-section">
                        <h2 className="section-title">
                            <FontAwesomeIcon icon={faNewspaper} size="lg" /> Latest Healthcare News
                        </h2>
                        {news.length === 0 ? (
                            <p className="message-p">No recent news available.</p>
                        ) : (
                            news.map((newsItem) => (
                                <div key={newsItem.id} className="news-item">
                                    <h4>{newsItem.title}</h4>
                                    <p>{newsItem.summary}</p>
                                    <button className="news-link-btn" onClick={() => window.open(newsItem.link, '_blank')}>
                                        Read more
                                    </button>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Healthcare Chatbot Section */}
                    <div className="recommendation-container chat-section">
                        <h2 className="section-title">
                            <FontAwesomeIcon icon={faComments} size="lg" /> Chat with Healthcare Chatbot
                        </h2>
                        <p className="message-p">Need help or have questions about your health? Chat with our healthcare chatbot for advice and assistance.</p>
                        <button className="chat-btn" onClick={() => window.open('/health/support', '_blank')}>
                            Start Chat
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}
