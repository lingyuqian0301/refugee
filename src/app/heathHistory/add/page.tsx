"use client"; 

import { useState } from "react";

interface ImmunizationRecord {
  id: string; // Change the type to string for formatted IDs
  name: string;
  date: string;
}

interface MedicalHistoryRecord {
  recordID: string; // Change the type to string for formatted IDs
  diagnosis: string;
  treatment: string;
  date: string;
  note: string;
}

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
  };

  return (
    <>
      <div style={{ maxWidth: '600px', margin: 'auto', padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }}>
        <h1 style={{ textAlign: 'center', color: '#333' }}>Add Health Record</h1>
        <form onSubmit={handleSubmit}>
          <h2 style={{ color: '#007bff' }}>Personal Health Details</h2>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ color: 'black' }}>Refugee ID: </label>
            <input
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', color: 'black' }}
              type="text"
              value={healthRecord.refugeeID}
              onChange={(e) => setHealthRecord({ ...healthRecord, refugeeID: e.target.value.toUpperCase() })} 
              placeholder="Enter Refugee ID"
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ color: 'black' }}>Gender: </label>
            <select
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', color: 'black' }}
              value={healthRecord.gender}
              onChange={(e) => setHealthRecord({ ...healthRecord, gender: e.target.value })}
            >
              <option value="" disabled>Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ color: 'black' }}>Blood Type: </label>
            <select
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', color: 'black' }}
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

          <h2 style={{ color: '#007bff', margin: "15px 0 10px 0" }}>Medical History</h2>
          {medicalHistories.map((record, index) => (
            <div key={index} style={{ border: "1px solid #ccc", padding: "10px", margin: "10px 0", borderRadius: '4px' }}>
              <div>
                <label style={{ color: 'black' }}>Diagnosis: </label>
                <input
                  style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', color: 'black' }}
                  type="text"
                  value={record.diagnosis}
                  onChange={(e) => handleMedicalHistoryChange(index, "diagnosis", e.target.value)}
                  placeholder="Diagnosis"
                />
              </div>
              <div>
                <label style={{ color: 'black' }}>Treatment: </label>
                <input
                  style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', color: 'black' }}
                  type="text"
                  value={record.treatment}
                  onChange={(e) => handleMedicalHistoryChange(index, "treatment", e.target.value)}
                  placeholder="Treatment"
                />
              </div>
              <div>
                <label style={{ color: 'black' }}>Date: </label>
                <input
                  style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', color: 'black' }}
                  type="date"
                  value={record.date}
                  onChange={(e) => handleMedicalHistoryChange(index, "date", e.target.value)}
                />
              </div>
              <div>
                <label style={{ color: 'black' }}>Note: </label>
                <textarea
                  style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', color: 'black' }}
                  value={record.note}
                  onChange={(e) => handleMedicalHistoryChange(index, "note", e.target.value)}
                  placeholder="Additional Notes"
                />
              </div>
              <button type="button" onClick={() => removeMedicalHistoryRecord(index)} style={{ marginTop: '10px', padding: '10px', backgroundColor: '#ff4d4d', color: '#fff', border: 'none', borderRadius: '4px' }}>
                Remove
              </button>
            </div>
          ))}
          <button type="button" onClick={addMedicalHistoryRecord} style={{ marginTop: '10px', padding: '10px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px' }}>
            Add Medical History
          </button>

          <h2 style={{ color: '#007bff', margin: "15px 0 10px 0" }}>Immunization Records</h2>
          {immunizations.map((record, index) => (
            <div key={index} style={{ border: "1px solid #ccc", padding: "10px", margin: "10px 0", borderRadius: '4px' }}>
              <div>
                <label style={{ color: 'black' }}>Name: </label>
                <input
                  style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', color: 'black' }}
                  type="text"
                  value={record.name}
                  onChange={(e) => handleImmunizationChange(index, "name", e.target.value)}
                  placeholder="Immunization Name"
                />
              </div>
              <div>
                <label style={{ color: 'black' }}>Date: </label>
                <input
                  style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', color: 'black' }}
                  type="date"
                  value={record.date}
                  onChange={(e) => handleImmunizationChange(index, "date", e.target.value)}
                />
              </div>
              <button type="button" onClick={() => removeImmunizationRecord(index)} style={{ marginTop: '10px', padding: '10px', backgroundColor: '#ff4d4d', color: '#fff', border: 'none', borderRadius: '4px' }}>
                Remove
              </button>
            </div>
          ))}
          <button type="button" onClick={addImmunizationRecord} style={{ marginTop: '10px', padding: '10px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px' }}>
            Add Immunization Record
          </button>

          <div>
            <button type="submit" style={{ marginTop: '20px', padding: '10px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px' }}>
              Submit Health Record
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
