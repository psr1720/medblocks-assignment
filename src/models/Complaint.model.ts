export interface Complaint {
  id?: number; 
  patient_id: number;
  date: string; 
  complaint: string;
  doctor: string;
  medicine: string;
}