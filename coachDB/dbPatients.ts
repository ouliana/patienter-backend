// import { Entry, Gender } from '../src/types';
import { config } from '../utils/config';
import Nano from 'nano';

import patients from '../data/patients';
import { patientsDesignDoc } from '../coachDB/designDocs';

if (!config.DB_HOST_AUTH) throw new Error('No DB host');

const nano = Nano(config.DB_HOST_AUTH);

export default (async function () {
  const dbName = config.DB_PATIENTS;

  const dbList = await nano.db.list();

  try {
    if (!dbList.includes(dbName)) {
      // create a new DB if database doesn't exist.
      await nano.db.create(dbName);
      console.log(`database ${dbName} created successfully`);

      const db = nano.use(dbName);
      await db.bulk({ docs: patients });

      await db.insert(patientsDesignDoc, '_design/patient');

      return db;
    } else {
      const db = nano.use(dbName);
      console.log(`connected to database ${dbName} successfully`);
      return db;
    }
  } catch (error: unknown) {
    let errorMessage = 'Something bad happened.';
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    throw new Error(errorMessage);
  }
})();
