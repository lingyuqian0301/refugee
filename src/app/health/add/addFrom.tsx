"use client";

import React from 'react';
import { useState } from "react";
import { Message } from 'rsuite';
import 'rsuite/dist/rsuite-no-reset.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrashCan, faUser, faBriefcaseMedical, faSyringe } from '@fortawesome/free-solid-svg-icons';
import '../health.css';
import { ImmunizationRecord, MedicalHistoryRecord } from '../../health/health_interface';

export default function AddHealthRecord() {
    const [immunizations, setImmunizations] = useState<ImmunizationRecord[]>([]);
    const [medicalHistories, setMedicalHistories] = useState<MedicalHistoryRecord[]>([]);

    const [healthRecord, setHealthRecord] = useState({
        refugeeID: "",
        gender: "",
        bloodType: "",
    });

    // Sequential counters for generating IDs
    const [immunizationCounter, setImmunizationCounter] = useState(1);
    const [medicalHistoryCounter, setMedicalHistoryCounter] = useState(1);

    const [successMessage, setSuccessMessage] = useState(false);

    // Function to generate formatted IDs during submission
    const generateImmunizationID = (counter: number): string => {
        return `IR${String(counter).padStart(3, '0')}`; // IR001, IR002, etc.
    };

    const generateMedicalHistoryID = (counter: number): string => {
        return `MH${String(counter).padStart(4, '0')}`; // MH0001, MH0002, etc.
    };

    // Function to handle adding new immunization record (without ID)
    const addImmunizationRecord = () => {
        setImmunizations([...immunizations, { id: "", name: "", date: "" }]); // Empty ID for now
    };

    // Function to handle removing an immunization record
    const removeImmunizationRecord = (index: number) => {
        const newImmunizations = immunizations.filter((_, i) => i !== index);
        setImmunizations(newImmunizations);
    };

    // Function to handle changes in the immunization inputs
    const handleImmunizationChange = (
        index: number,
        field: keyof ImmunizationRecord,
        value: string
    ) => {
        const newImmunizations = [...immunizations];
        newImmunizations[index][field] = value;
        setImmunizations(newImmunizations);
    };

    // Function to handle adding new medical history record (without ID)
    const addMedicalHistoryRecord = () => {
        setMedicalHistories([...medicalHistories, { recordID: "", diagnosis: "", treatment: "", date: "", note: "" }]); // Empty ID for now
    };

    // Function to handle removing a medical history record
    const removeMedicalHistoryRecord = (index: number) => {
        const newMedicalHistories = medicalHistories.filter((_, i) => i !== index);
        setMedicalHistories(newMedicalHistories);
    };

    // Function to handle changes in the medical history inputs
    const handleMedicalHistoryChange = (
        index: number,
        field: keyof MedicalHistoryRecord,
        value: string
    ) => {
        const newMedicalHistories = [...medicalHistories];
        newMedicalHistories[index][field] = value;
        setMedicalHistories(newMedicalHistories);
    };

    // Function to handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Assign IDs during form submission
        const immunizationRecordsWithIDs = immunizations.map((record, index) => ({
            ...record,
            id: generateImmunizationID(immunizationCounter + index),
        }));

        const medicalHistoriesWithIDs = medicalHistories.map((record, index) => ({
            ...record,
            recordID: generateMedicalHistoryID(medicalHistoryCounter + index),
        }));

        const fullRecord = {
            ...healthRecord,
            immunizationRecords: immunizationRecordsWithIDs,
            medicalHistories: medicalHistoriesWithIDs,
        };

        console.log("Form Submitted:", fullRecord);

        // Reset form
        setHealthRecord({ refugeeID: "", gender: "", bloodType: "" });
        setImmunizations([]);
        setMedicalHistories([]);
        setSuccessMessage(true);

        // Scroll to top after submitting the form
        window.scrollTo({ top: 0, behavior: "smooth" });

        // Hide success message after 3 seconds
        setTimeout(() => {
            setSuccessMessage(false);
        }, 3000);
    };

    return (
        <div style={{ minWidth: "100%", minHeight: '100vh', padding: '20px 0', backgroundColor: '#F4F7FE' }}>



            <h1 style={{ textAlign: 'center' }} className="page-title">Add Health Record</h1>
            <form onSubmit={handleSubmit}>
                <div style={{ maxWidth: '800px', margin: '20px auto', padding: '20px', backgroundColor: '#fff', borderRadius: '10px' }}>
                    <h2 className="section-title "><FontAwesomeIcon icon={faUser} /> Personal Health Details</h2>
                    {/* <div className="form-input-div">
            <label>Refugee ID: </label>
            <input
              type="text"
              value={healthRecord.refugeeID}
              onChange={(e) => setHealthRecord({ ...healthRecord, refugeeID: e.target.value.toUpperCase() })}
              placeholder="Enter Refugee ID"
            />
          </div> */}
                    <div className="form-input-div">
                        <label>Gender: </label>
                        <select
                            value={healthRecord.gender}
                            onChange={(e) => setHealthRecord({ ...healthRecord, gender: e.target.value })}
                        >
                            <option value="" disabled>Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div className="form-input-div">
                        <label>Blood Type: </label>
                        <select
                            value={healthRecord.bloodType}
                            onChange={(e) => setHealthRecord({ ...healthRecord, bloodType: e.target.value })}
                        >
                            <option value="" disabled>Select Blood Type</option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                        </select>
                    </div>
                </div>

                <div style={{ maxWidth: '800px', margin: '20px auto', padding: '20px', backgroundColor: '#fff', borderRadius: '10px' }}>
                    <h2 className="section-title"><FontAwesomeIcon icon={faBriefcaseMedical} /> Medical History {medicalHistories.length > 0 ? `(${medicalHistories.length})` : ""}</h2>
                    {medicalHistories.length === 0 ? (
                        <p className="message-p">No medical history records added.</p>
                    ) : (medicalHistories.map((record, index) => (
                        <div key={index} >
                            <div className="form-input-div">
                                <label>Diagnosis: </label>
                                <input
                                    type="text"
                                    value={record.diagnosis}
                                    onChange={(e) => handleMedicalHistoryChange(index, "diagnosis", e.target.value)}
                                    placeholder="Diagnosis"
                                />
                            </div>
                            <div className="form-input-div">
                                <label>Treatment: </label>
                                <input
                                    type="text"
                                    value={record.treatment}
                                    onChange={(e) => handleMedicalHistoryChange(index, "treatment", e.target.value)}
                                    placeholder="Treatment"
                                />
                            </div>
                            <div className="form-input-div">
                                <label>Date: </label>
                                <input
                                    type="date"
                                    value={record.date}
                                    onChange={(e) => handleMedicalHistoryChange(index, "date", e.target.value)}
                                />
                            </div>
                            <div className="form-input-div">
                                <label>Note: </label>
                                <textarea
                                    value={record.note}
                                    onChange={(e) => handleMedicalHistoryChange(index, "note", e.target.value)}
                                    placeholder="Additional Notes"
                                />
                            </div>
                            <div style={{ width: '100%', display: 'flex', justifyContent: 'right' }}>
                                <button type="button" className="remove-input-btn" onClick={() => removeMedicalHistoryRecord(index)}>
                                    <FontAwesomeIcon icon={faTrashCan} /> Remove
                                </button>
                            </div>
                        </div>
                    )))}
                    <button type="button" className="add-input-btn" onClick={addMedicalHistoryRecord}>
                        <FontAwesomeIcon icon={faPlus} /> Add Medical History
                    </button>
                </div>

                <div style={{ maxWidth: '800px', margin: '20px auto', padding: '20px', backgroundColor: '#fff', borderRadius: '10px' }}>
                    <h2 className="section-title"><FontAwesomeIcon icon={faSyringe} /> Immunization Records {immunizations.length > 0 ? `(${immunizations.length})` : ""}</h2>
                    {immunizations.length === 0 ? (
                        <p className="message-p">No immunization records added.</p>
                    ) : (immunizations.map((record, index) => (
                        <div key={index}>
                            <div className="form-input-div">
                                <label>Name: </label>
                                <input
                                    type="text"
                                    value={record.name}
                                    onChange={(e) => handleImmunizationChange(index, "name", e.target.value)}
                                    placeholder="Immunization Name"
                                />
                            </div>
                            <div className="form-input-div">
                                <label>Date: </label>
                                <input
                                    type="date"
                                    value={record.date}
                                    onChange={(e) => handleImmunizationChange(index, "date", e.target.value)}
                                />
                            </div>
                            <div style={{ width: '100%', display: 'flex', justifyContent: 'right' }}>
                                <button type="button" className="remove-input-btn" onClick={() => removeImmunizationRecord(index)}>
                                    <FontAwesomeIcon icon={faTrashCan} /> Remove
                                </button>
                            </div>
                        </div>
                    )))}
                    <button type="button" className="add-input-btn" onClick={addImmunizationRecord}>
                        <FontAwesomeIcon icon={faPlus} />  Add Immunization Record
                    </button>
                </div>

                <div>
                    <div style={{ maxWidth: '800px', margin: '30px auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <button type="submit" className="submit-btn">
                            Submit Health Record
                        </button>
                    </div>
                </div>
            </form>

            {successMessage && (
                <div style={{ maxWidth: '800px', margin: '20px auto' }}>
                    <Message type="success" bordered showIcon>
                        <strong>Success!</strong> You have successfully submitted the health record.
                    </Message>
                </div>
            )}
        </div>
    );
}
