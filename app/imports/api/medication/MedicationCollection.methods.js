import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin';
import { Medications } from './MedicationCollection';

/**
 * Meteor method used to define new instances of the given collection name.
 * @param collectionName the name of the collection.
 * @param definitionDate the object used in the collection.define method.
 * @memberOf api/base
 */
export const medicationDefineMethod = new ValidatedMethod({
  name: 'MedicationCollection.define',
  mixins: [CallPromiseMixin],
  validate: null,
  run(definitionData) {
    // console.log('medicationDefineMethod', definitionData);
    if (Meteor.isServer) {
      const docID = Medications.define(definitionData);
      // console.log(`medicationDefineMethod returning ${docID}. Now have ${Medications.count()}`);
      return docID;
    }
    return '';
  },
});

export const medicationUpdateMethod = new ValidatedMethod({
  name: 'MedicationCollection.update',
  mixins: [CallPromiseMixin],
  validate: null,
  run(updateData) {
    Medications.update(updateData.id, updateData);
    // Medications.update(updateData);
    return true;
  },
});

export const medicationRemoveItMethod = new ValidatedMethod({
  name: 'MedicationCollection.removeIt',
  mixins: [CallPromiseMixin],
  validate: null,
  run(instance) {
    return Medications.removeIt(instance);
  },
});
