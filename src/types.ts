export interface DiagnoseEntry {
  code: string;
  name: string;
  latin?: string;
}

export type Diagnose = DiagnoseEntry;

export type Gender = 'female' | 'male' | 'other';

export interface PatientEntry {
  id: string;
  name: string;
  dateOfBirth: string;
  ssn: string;
  gender: Gender;
  occupation: string;
}

export type Patient = PatientEntry;
export type PatientNonSentitive = Omit<Patient, 'ssn'>;
