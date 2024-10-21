"use client";

import React from 'react';
import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBriefcaseMedical, faSyringe, faRobot } from '@fortawesome/free-solid-svg-icons';
import '../health.css';
import {ImmunizationRecord,MedicalHistoryRecord} from '../../health/health_interface';

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

    // Dummy AI-driven recommendations
    const [recommendations] = useState([
        {
            id: 1,
            advice: "Since you have a history of asthma, it is recommended to carry an inhaler at all times, especially during physical activities.",
        },
        {
            id: 2,
            advice: "You are due for a follow-up on your Hepatitis B vaccination. Consider scheduling an appointment for a booster shot.",
        },
        {
            id: 3,
            advice: "Ensure regular physiotherapy exercises to maintain mobility after your arm fracture surgery.",
        },
    ]);

    return (
        <div style={{ minWidth: "100%", minHeight: '100vh', padding: '20px', backgroundColor: '#F4F7FE' }}>

            <h1 style={{ textAlign: 'center' }} className="page-title">View Health Record</h1>

            <div style={{ maxWidth: '800px', margin: '20px auto', padding: '20px', backgroundColor: '#fff', borderRadius: '10px' }}>
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

            <div style={{ maxWidth: '800px', margin: '20px auto', padding: '20px', backgroundColor: '#fff', borderRadius: '10px' }}>
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

            <div style={{ maxWidth: '800px', margin: '20px auto', padding: '20px', backgroundColor: '#fff', borderRadius: '10px' }}>
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

            {/* AI-Driven Healthcare Recommendations Section */}
            <div style={{ maxWidth: '800px', margin: '20px auto', padding: '20px', backgroundColor: '#fff', borderRadius: '10px' }}>
                <h2 className="section-title">
                    <FontAwesomeIcon icon={faRobot} /> AI-Driven Healthcare Recommendations
                </h2>
                {recommendations.length === 0 ? (
                    <p className="message-p recommend-p">No recommendations available at this time.</p>
                ) : (
                    recommendations.map((recommendation) => (
                        <div key={recommendation.id} style={{ marginBottom: '20px' }}>
                            <p className="recommend-p">{recommendation.advice}</p>
                        </div>
                    ))
                )}
            </div>

            <div>
                <div style={{ maxWidth: '800px', margin: '30px auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <button type="button" className="back-home-btn">
                        Back to home
                    </button>
                </div>
            </div>
        </div>
    );
}
