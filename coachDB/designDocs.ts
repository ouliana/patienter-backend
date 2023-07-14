export const patientsDesignDoc = {
  _id: '_design/patient',
  views: {
    by_id: {
      map: 'function(doc){ emit(doc._id, {name: doc.name, dateOfBirth: doc.dateOfBirth, ssn: doc.ssn, gender: doc.gender, occupation: doc.occupation, entries: doc:entries, id: doc._id})}',
    },
  },
};
