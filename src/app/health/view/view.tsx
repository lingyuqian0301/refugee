
"use client";

import React from 'react';
import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBriefcaseMedical, faSyringe, faCalendarAlt, faRobot, faComments } from '@fortawesome/free-solid-svg-icons';
import '../health.css';
import { ImmunizationRecord, MedicalHistoryRecord } from '../../health/health_interface';

export default function ViewHealthRecord() {
    const [healthRecord] = useState({
        refugeeID: "MM-2024-01-0001",
        gender: "Male",
        bloodType: "O+",
    });

    const [immunizations] = useState<ImmunizationRecord[]>([
        { id: "IR001", name: "Hepatitis B", date: "2021-05-10" },
        { id: "IR002", name: "Tetanus", date: "2022-03-22" },
    ]);

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

    const [appointments] = useState([
        {
            id: 1,
            date: "2024-11-15",
            reason: "Hepatitis B Booster Vaccine",
            doctor: "Dr. Smith",
        },
        {
            id: 2,
            date: "2024-12-05",
            reason: "Asthma Follow-up",
            doctor: "Dr. Johnson",
        },
    ]);

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

    return (
        <div style={{ minWidth: "100%", minHeight: '100vh', padding: '20px', backgroundColor: '#F4F7FE' }}>

            <h1 style={{ textAlign: 'center' }} className="page-title">View Health Record</h1>

            <div className='health-content'>
                <div className='health-content-left'>
                    <div className='health-view-div'>
                        <h2 className="section-title">
                            <FontAwesomeIcon icon={faUser} /> Personal Health Details
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
                            <FontAwesomeIcon icon={faBriefcaseMedical} /> Medical History {medicalHistories.length > 0 ? `(${medicalHistories.length})` : ""}
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
                            <FontAwesomeIcon icon={faSyringe} /> Immunization Records {immunizations.length > 0 ? `(${immunizations.length})` : ""}
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
                    </div>
                </div>

                <div className='health-content-right'>
                    {/* Medical Appointments Section */}
                    <div className="recommendation-container">
                        <h2 className="section-title">
                            <FontAwesomeIcon icon={faCalendarAlt} /> Upcoming Medical Appointments
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
                    </div>

                    {/* AI-Driven Healthcare Recommendations Section */}
                    <div className="recommendation-container">
                        <h2 className="section-title">
                            <FontAwesomeIcon icon={faRobot} /> AI-Driven Healthcare Recommendations
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

                    {/* Healthcare Chatbot Section */}
                    <div className="recommendation-container chat-section">
                        <h2 className="section-title">
                            <FontAwesomeIcon icon={faComments} /> Chat with Healthcare Chatbot
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
