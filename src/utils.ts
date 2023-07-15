import {
  NewPatient,
  Gender,
  NewEntry,
  SickLeave,
  Discharge,
  HealthCheckEntry,
  BaseEntry,
  HealthCheckRating,
  OccupationalHealthcareEntry,
  HospitalEntry,
} from './types';

const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

const isNumber = (text: unknown): text is number => {
  return typeof text === 'number' || text instanceof Number;
};

// PATIENT

const parseName = (name: unknown): string => {
  if (isString(name)) return name;
  throw new Error('Incorrect or missing name');
};

const isDateOfBirth = (dateOfBirth: string): boolean => {
  return Boolean(Date.parse(dateOfBirth));
};

const parseDateOfBirth = (dateOfBirth: unknown): string => {
  if (!isString(dateOfBirth) || !isDateOfBirth(dateOfBirth)) {
    throw new Error('Incorrect or missing date of birth');
  }
  return dateOfBirth;
};

const parseSSN = (ssn: unknown): string => {
  if (!isString(ssn)) {
    throw new Error('Incorrect or missing social security number');
  }
  return ssn;
};

const isGender = (gender: string): gender is Gender => {
  return Object.values(Gender)
    .map(v => v.toString())
    .includes(gender);
};

const parseGender = (gender: unknown): Gender => {
  if (!isString(gender) || !isGender(gender)) {
    throw new Error('Incorrect or missing gender');
  }
  return gender;
};

const parseOccupation = (occupation: unknown): string => {
  if (!isString(occupation)) {
    throw new Error('Incorrect or missing occupation');
  }
  return occupation;
};

export const toNewPatient = (object: unknown): NewPatient => {
  if (!object || typeof object !== 'object') {
    throw new Error('Invalid data');
  }

  if (
    'name' in object &&
    'dateOfBirth' in object &&
    'ssn' in object &&
    'gender' in object &&
    'occupation' in object
  ) {
    return {
      name: parseName(object.name),
      dateOfBirth: parseDateOfBirth(object.dateOfBirth),
      ssn: parseSSN(object.ssn),
      gender: parseGender(object.gender),
      occupation: parseOccupation(object.occupation),
      entries: [],
    };
  }

  throw new Error('Missing data');
};

// ENTRY

const parseID = (id: unknown): string => {
  if (isString(id)) return id;
  throw new Error('Incorrect or missing id');
};

const parseDescription = (description: unknown): string => {
  if (isString(description)) return description;
  throw new Error('Incorrect or missing description');
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const parseDate = (date: unknown): string => {
  if (!isString(date) || !isDate(date)) {
    throw new Error('Incorrect or missing date');
  }
  return date;
};

const parseSpecialist = (specialist: unknown): string => {
  if (isString(specialist)) return specialist;
  throw new Error('Incorrect or missing specialist');
};

const isDiagnosisCodes = (
  diagnosisCodes: unknown
): diagnosisCodes is string[] => {
  return (
    Array.isArray(diagnosisCodes) &&
    diagnosisCodes.reduce(
      (res: boolean, curr: unknown) => (res &&= res && isString(curr)),
      true
    )
  );
};

const parseDiagnosisCode = (diagnosisCodes: unknown): string[] => {
  if (isDiagnosisCodes(diagnosisCodes)) return diagnosisCodes;
  throw new Error('Invalid or missing diagnosisCodes');
};

const isSickLeave = (sickLeave: unknown): sickLeave is SickLeave => {
  if (!sickLeave || typeof sickLeave !== 'object') {
    throw new Error('Invalid data');
  }

  return (
    'startDate' in sickLeave &&
    isString(sickLeave.startDate) &&
    'endDate' in sickLeave &&
    isString(sickLeave.endDate)
  );
};

const parseSickLeave = (object: unknown): SickLeave => {
  if (isSickLeave(object)) {
    return {
      startDate: object.startDate,
      endDate: object.endDate,
    };
  }

  throw new Error('Invalid data');
};

const isDischarge = (obj: object): obj is Discharge => {
  return (
    'date' in obj &&
    isString(obj.date) &&
    'criteria' in obj &&
    isString(obj.criteria)
  );
};

const parseDischarge = (object: unknown): Discharge => {
  if (!object || typeof object !== 'object') {
    throw new Error('Invalid data');
  }

  if (isDischarge(object)) {
    return {
      date: object.date,
      criteria: object.criteria,
    };
  }

  throw new Error('Invalid data');
};

const toBaseEntry = (obj: object): BaseEntry => {
  if (
    'id' in obj &&
    'description' in obj &&
    'date' in obj &&
    'specialist' in obj
  ) {
    const entry = {
      id: parseID(obj.id),
      description: parseDescription(obj.description),
      date: parseDate(obj.date),
      specialist: parseSpecialist(obj.specialist),
    };
    if ('diagnosisCodes' in obj) {
      Object.defineProperty(entry, 'diagnosisCodes', {
        enumerable: true,
        configurable: true,
        writable: true,
        value: parseDiagnosisCode(obj.diagnosisCodes),
      });
    }
    return entry;
  }
  throw new Error('Invalid or missing data for BaseEntry');
};

const isHealthCheckRating = (rating: number): rating is HealthCheckRating => {
  return Object.values(HealthCheckRating)
    .map(v => v.valueOf())
    .includes(rating);
};

const parseHealthCheckRating = (rating: unknown): HealthCheckRating => {
  if (isNumber(rating) && isHealthCheckRating(rating)) return rating;
  throw new Error('Invalid healthCheckRating');
};

const toHealthCheckEntry = (obj: object): HealthCheckEntry => {
  const entry = toBaseEntry(obj);

  if ('type' in obj && 'healthCheckRating' in obj) {
    return {
      ...entry,
      type: 'HealthCheck',
      healthCheckRating: parseHealthCheckRating(obj.healthCheckRating),
    } as HealthCheckEntry;
  }

  throw new Error('Invalid os insufficient data for HealthCheckEntry');
};

const parseEmployerName = (employerName: unknown): string => {
  if (isString(employerName)) return employerName;
  throw new Error('Incorrect or missing employerName');
};

const toOccupationalHealthcareEntry = (
  obj: object
): OccupationalHealthcareEntry => {
  const entry = toBaseEntry(obj);

  if ('type' in obj && 'employerName' in obj) {
    const res = {
      ...entry,
      type: 'OccupationalHealthcareEntry',
      employerName: parseEmployerName(obj.employerName),
    };
    if ('sickLeave' in obj && isSickLeave(obj.sickLeave)) {
      Object.defineProperty(res, 'sickLeave', {
        enumerable: true,
        configurable: true,
        writable: true,
        value: parseSickLeave(obj.sickLeave),
      });
    }
    return res as OccupationalHealthcareEntry;
  }

  throw new Error(
    'Invalid os insufficient data for OccupationalHealthcareEntry'
  );
};

const toHospitalEntry = (obj: object): HospitalEntry => {
  const entry = toBaseEntry(obj);

  if ('type' in obj && 'discharge' in obj) {
    return {
      ...entry,
      type: 'Hospital',
      discharge: parseDischarge(obj.discharge),
    } as HospitalEntry;
  }

  throw new Error('Invalid os insufficient data for HospitalEntry');
};

export const toNewEntry = (object: unknown): NewEntry => {
  if (!object || typeof object !== 'object') {
    throw new Error('Invalid data');
  }

  if (!('type' in object)) throw new Error('Invalid data');

  switch (object.type) {
    case 'HealthCheck':
      return toHealthCheckEntry(object);
    case 'OccupationalHealthcare':
      return toOccupationalHealthcareEntry(object);
    case 'Hospital':
      return toHospitalEntry(object);
    default:
      throw new Error('Wrong type value');
  }
};
