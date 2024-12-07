export interface ImmunizationRecord {
    id: string;
    name: string;
    date: string;
    createdAt?: string;
}

export interface MedicalHistoryRecord {
    recordID: string;
    diagnosis: string;
    treatment: string;
    date: string;
    note: string;
}