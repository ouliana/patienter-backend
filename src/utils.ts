import {
  NewPatient,
  Gender,
  Patient,
  Entry,
  Diagnosis,
  HealthCheckRating,
  DateRange,
} from './types';

const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

const isNumber = (text: unknown): text is number => {
  return typeof text === 'number' || text instanceof Number;
};

const parseName = (name: unknown): string => {
  if (!isString(name)) {
    throw new Error('Incorrect or missing name');
  }
  return name;
};

const parseString = (name: unknown): string => {
  if (!isString(name)) {
    throw new Error('Incorrect or missing name');
  }
  return name;
};

const isDate = (dateOfBirth: string): boolean => {
  return Boolean(Date.parse(dateOfBirth));
};

const parseDate = (date: unknown): string => {
  if (!isString(date) || !isDate(date)) {
    throw new Error('Incorrect or missing date');
  }
  return date;
};

const parseDateOfBirth = (dateOfBirth: unknown): string => {
  if (!isString(dateOfBirth) || !isDate(dateOfBirth)) {
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

const isRating = (rating: number): rating is HealthCheckRating => {
  return Object.values(HealthCheckRating)
    .map(v => v.valueOf())
    .includes(rating);
};

const parsehealthCheckRating = (rating: unknown): HealthCheckRating => {
  if (!isNumber(rating) || !isRating(rating)) {
    throw new Error('Incorrect or missing healthCheckRating');
  }
  return rating;
};

const toDiagnosis = (code: string): Diagnosis => {
  return {
    code,
    name: '',
    latin: '',
  };
};

const parseCodes = (codes: unknown): Array<Diagnosis['code']> => {
  if (!Array.isArray(codes)) throw new Error('error');

  const res = codes.map(code => {
    if (!isString(code)) throw new Error('error');
    return toDiagnosis(code);
  });
  return res.map(r => r.code);
};

const toDateRange = (range: unknown): DateRange => {
  if (!range || typeof range !== 'object') {
    throw new Error('Invalid data');
  }

  if ('startDate' in range && 'endDate' in range) {
    if (
      isString(range.startDate) &&
      isDate(range.startDate) &&
      isString(range.endDate) &&
      isDate(range.endDate)
    ) {
      return { startDate: range.startDate, endDate: range.endDate };
    }
  }
  throw new Error('Invalid or insufficient data');
};

const toEntry = (object: unknown): Entry => {
  if (!object || typeof object !== 'object') {
    throw new Error('Invalid data');
  }
  if (!('type' in object)) throw new Error('Invalid data');

  let entry;
  if (
    'id' in object &&
    'description' in object &&
    'date' in object &&
    'specialist' in object
  ) {
    entry = {
      type: parseString(object.type),
      id: parseString(object.id),
      description: parseString(object.description),
      date: parseDate(object.date),
      specialist: parseString(object.specialist),
    };
  } else {
    throw new Error('error');
  }

  if ('diagnosisCodes' in object) {
    entry = {
      ...entry,
      diagnosisCodes: parseCodes(object.diagnosisCodes),
    };
  }

  switch (object.type) {
    case 'HealthCheck':
      if ('healthCheckRating' in object) {
        return {
          ...entry,
          healthCheckRating: parsehealthCheckRating(object.healthCheckRating),
        } as Entry;
      }
      throw new Error('error');
    case 'OccupationalHealthcare':
      if ('sickLeave' in object) {
        if (typeof object.sickLeave !== 'object') throw new Error('error');
        return {
          ...entry,
          sickLeave: toDateRange(object.sickLeave),
        } as Entry;
      }
      return entry as Entry;
    default:
      throw new Error('Invalid data');
  }
};

const parseEntries = (entries: unknown): Entry[] => {
  if (!Array.isArray(entries)) throw new Error('Invalid entries');
  return entries.map(e => toEntry(e));
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

export const toPatient = (object: unknown): Patient => {
  if (!object || typeof object !== 'object') {
    throw new Error('Invalid data');
  }

  if (
    'id' in object &&
    'name' in object &&
    'dateOfBirth' in object &&
    'ssn' in object &&
    'gender' in object &&
    'occupation' in object &&
    'entries' in object
  ) {
    return {
      id: parseString(object.id),
      name: parseName(object.name),
      dateOfBirth: parseDateOfBirth(object.dateOfBirth),
      ssn: parseSSN(object.ssn),
      gender: parseGender(object.gender),
      occupation: parseOccupation(object.occupation),
      entries: parseEntries(object.entries),
    };
  }

  throw new Error('Missing data');
};
