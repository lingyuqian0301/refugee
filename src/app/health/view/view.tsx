"use client";

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBriefcaseMedical, faSyringe, faPlus, faCalendarAlt, faRobot, faComments, faNewspaper, faAppleAlt } from '@fortawesome/free-solid-svg-icons';
import '../health.css';
import { ImmunizationRecord, MedicalHistoryRecord } from '../../health/health_interface';
import { createClient } from '../../../utils/supabase/client';

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
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Supabase client initialization
    const supabaseClient = createClient();

    // Fetch appointments from Supabase
    useEffect(() => {
        const fetchAppointments = async () => {
            setIsLoading(true);
            try {
                const { data, error } = await supabaseClient
                    .from('appointments')
                    .select('*')
                    .order('date', { ascending: true }); // Sort by date if needed
                
                if (error) throw new Error(error.message);

                setAppointments(data || []);
                setError(null);
            } catch (error: any) {
                console.error('Error fetching appointments from Supabase:', error);
                setError(error.message);
                setAppointments([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAppointments();
    }, [supabaseClient]);

    // Fetch immunization records from Supabase
    // useEffect(() => {
    //     const fetchImmunizations = async () => {
    //         try {
    //             const { data, error } = await supabaseClient
    //                 .from('immunizations') // Replace with your actual table name
    //                 .select('*');

    //             if (error) throw new Error(error.message);
    //             setImmunizations(data || []);
    //         } catch (error) {
    //             console.error('Error fetching immunizations from Supabase:', error);
    //         }
    //     };

    //     fetchImmunizations();
    // }, [supabaseClient]);

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
    ]);

    const [dietaryGuidelines] = useState<DietaryGuideline[]>([
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
                    <div className="recommendation-container">
                        <h2 className="section-title">
                            <FontAwesomeIcon icon={faCalendarAlt} size="lg" /> Upcoming Medical Appointments
                        </h2>
                        {isLoading ? (
                            <p>Loading appointments...</p>
                        ) : error ? (
                            <p>Error: {error}</p>
                        ) : appointments.length === 0 ? (
                            <p className="message-p">No upcoming appointments.</p>
                        ) : (
                            <table className="appointments-table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Time</th>
                                        <th>Hospital</th>
                                        <th>Doctor</th>
                                        <th>Reason</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {appointments.map((appointment) => (
                                        <tr key={appointment.id}>
                                            <td>{new Date(appointment.date).toLocaleDateString()}</td>
                                            <td>{appointment.time}</td>
                                            <td>{appointment.hospital}</td>
                                            <td>{appointment.doctor}</td>
                                            <td>{appointment.reason}</td>
                                            <td>
                                                <span className={`status-${appointment.status.toLowerCase()}`}>
                                                    {appointment.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                        <button className="section-bot-btn" onClick={() => window.open('/health/appointment', '_blank')}>
                            <FontAwesomeIcon icon={faPlus} /> Make an appointment
                        </button>
                    </div>

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

                    <div className="recommendation-container">
                        <h2 className="section-title">
                            <FontAwesomeIcon icon={faNewspaper} size="lg" /> Healthcare News
                        </h2>
                        {news.map((newsItem) => (
                            <div key={newsItem.id} className="news-item">
                                <h3 className="news-title">{newsItem.title}</h3>
                                <p className="news-summary">{newsItem.summary}</p>
                                <a href={newsItem.link} className="news-link">Read more</a>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
