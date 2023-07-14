import express from 'express';
import patientService from '../services/patientService';
// import { toNewPatient } from '../utils';

const router = express.Router();

// router.get('/', (_req, res) => {
//   return res.send(patientService.getPatientsNonSensitive());
// });

router.get('/:id', (req, res) => {
  return res.send(patientService.getPatient(req.params.id));
});

// router.post('/', (req, res) => {
//   try {
//     const newPatient = toNewPatient(req.body);
//     const addedPatient = patientService.addPatient(newPatient);
//     res.json(addedPatient);
//   } catch (error: unknown) {
//     let errorMessage = 'Something bad happened. ';
//     if (error instanceof Error) {
//       errorMessage += ' Error: ' + error.message;
//     }
//     res.status(400).send(errorMessage);
//   }
// });

router.post('/:id/entries', (_, res) => {
  try {
    // todo
  } catch (error: unknown) {
    let errorMessage = 'Something bad happened. ';
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    res.status(400).send(errorMessage);
  }
});

export default router;
