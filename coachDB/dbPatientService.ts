import dbPatients from './dbPatients';

const findAll = async () => {
  const response = await (await dbPatients).view('patient', 'by_id');
  return response.rows.map(r => r.value);
};

const patientsServise = {
  findAll,
};

export default patientsServise;
