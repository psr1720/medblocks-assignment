export interface Patient {
  id?: number;
  name: string;
  phone: string;
  address?: string;
  email?: string;
  dob: string;
  sex: "male" | "female" | "other";
  height?: number;
  weight?: number;
  created_at?: string;
}
