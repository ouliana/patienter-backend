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
};
