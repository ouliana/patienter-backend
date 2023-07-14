import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT;
const DB_HOST_AUTH = process.env.DB_HOST_AUTH;

const DB_PATIENTS =
  process.env.NODE_ENV === 'test' ? 'test_patients' : 'patients';
const DB_DIAGNOSES =
  process.env.NODE_ENV === 'test' ? 'test_diagnoses' : 'diagnoses';

export const config = {
  PORT,
  DB_HOST_AUTH,
  DB_PATIENTS,
  DB_DIAGNOSES,
};
