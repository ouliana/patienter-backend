import dbPatients from '../../coachDB/dbPatients';
import { Patient } from '../types';
import { toPatient } from '../utils';

// const getPatientsNonSensitive = (): PatientNonSentitive[] => {
//   return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
//     id,
//     name,
//     dateOfBirth,
//     gender,
//     occupation,
//   }));
// };

const getPatient = async (id: string): Promise<Patient> => {
  const response = await (
    await dbPatients
  ).view('patient', 'by_id', { key: id });

  if (!response.rows.length) throw new Error('Not found');

  const patient = toPatient(response.rows[0].value);

  return patient;
};

// const addPatient = (patient: NewPatient): Patient => {
//   const addedPatient = {
//     id,
//     ...patient,
//   };
//   patients.push(addedPatient);
//   return addedPatient;
// };

export default {
  // getPatientsNonSensitive,
  // addPatient,
  getPatient,
};
