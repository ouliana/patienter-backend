import { Patient, PatientNonSentitive, NewPatient } from '../types';
import patients from '../../data/patients';
import { v1 as uuid } from 'uuid';

const id: string = uuid();

const getPatientsNonSensitive = (): PatientNonSentitive[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
  }));
};

const getPatient = (id: string): Patient => {
  const patient = patients.find(p => p.id === id);
  if (patient) {
    return patient;
  }

  throw new Error('Patient not found');
};

const addPatient = (patient: NewPatient): Patient => {
  const addedPatient = {
    id,
    ...patient,
  };
  patients.push(addedPatient);
  return addedPatient;
};

export default {
  getPatientsNonSensitive,
  addPatient,
  getPatient,
};
