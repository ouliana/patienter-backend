import { PatientNonSentitive } from '../types';
import patients from '../../data/patients';

const getPatientsNonSensitive = (): PatientNonSentitive[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
  }));
};

export default {
  getPatientsNonSensitive,
};
