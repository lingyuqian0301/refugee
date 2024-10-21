
export interface ImmunizationRecord {
    id: string; // Change the type to string for formatted IDs
    name: string;
    date: string;
  }
  
  export interface MedicalHistoryRecord {
    recordID: string; // Change the type to string for formatted IDs
    diagnosis: string;
    treatment: string;
    date: string;
    note: string;
  }