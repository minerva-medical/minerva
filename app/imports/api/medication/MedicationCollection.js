import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { _ } from 'meteor/underscore';
import BaseCollection from '../base/BaseCollection';

export const medicationPublications = {
  medication: 'Medication',
  medicationAdmin: 'MedicationAdmin',
};

class MedicationCollection extends BaseCollection {
  constructor() {
    super('Medications', new SimpleSchema({
      drug: String,
      drugType: String,
      brand: String,
      lotId: String,
      expire: String, // date string "YYYY-MM-DD"
      quantity: Number,
      isTabs: Boolean,
      location: String,
      purchased: Boolean,
    }));
  }

  /**
   * Defines a new Medication item.
   * @param name the name of the item.
   * @param quantity how many.
   * @param owner the owner of the item.
   * @param condition the condition of the item.
   * @return {String} the docID of the new document.
   */
  define({ drug, drugType, brand, lotId, expire, quantity, isTabs, location, purchased }) {
    const docID = this._collection.insert({
      drug, drugType, brand, lotId, expire, quantity, isTabs, location, purchased,
    });
    return docID;
  }

  /**
   * Updates the given document.
   * @param docID the id of the document to update.
   * @param name the new name (optional).
   * @param quantity the new quantity (optional).
   * @param condition the new condition (optional).
   */
  update(docID, { brand, lotId, expire, quantity, location, purchased }) {
    const updateData = {};

    /**
     * adds String data if not falsy (in this case: empty, null, or undefined)
     * @param data
     */
    function addData(data) {
      if (data) {
        updateData[data] = data;
      }
    }
    addData(brand);
    addData(lotId);
    addData(expire);
    // if (quantity) { NOTE: 0 is falsy so we need to check if the quantity is a number.
    if (_.isNumber(quantity)) {
      updateData.quantity = quantity;
    }
    addData(location);
    if (_.isBoolean(purchased)) {
      updateData.purchased = purchased;
    }
    this._collection.update(docID, { $set: updateData });
  }

  /**
   * A stricter form of remove that throws an error if the document or docID could not be found in this collection.
   * @param { String | Object } name A document or docID in this collection.
   * @returns true
   */
  removeIt({ brand, lotId }) {
    // TODO
    // const doc = this.findDoc(name);
    // check(doc, Object);
    this._collection.remove({ brand, lotId });
    return true;
  }

  /**
   * Default publication method for entities.
   * It publishes the entire collection for admin and just the medication associated to an owner.
   */
  publish() {
    if (Meteor.isServer) {
      // get the MedicationCollection instance.
      const instance = this;
      /** This subscription publishes only the documents associated with the logged in user */
      Meteor.publish(medicationPublications.medication, function publish() {
        if (this.userId) {
          // const username = Meteor.users.findOne(this.userId).username;
          return instance._collection.find();
        }
        return this.ready();
      });

      /** This subscription publishes all documents regardless of user, but only if the logged in user is the Admin. */
      Meteor.publish(medicationPublications.medicationAdmin, function publish() {
        if (this.userId) {
          return instance._collection.find();
        }
        return this.ready();
      });
    }
  }

  /**
   * Subscription method for medication owned by the current user.
   */
  subscribeMedication() {
    if (Meteor.isClient) {
      return Meteor.subscribe(medicationPublications.medication);
    }
    return null;
  }

  /**
   * Subscription method for admin users.
   * It subscribes to the entire collection.
   */
  subscribeMedicationAdmin() {
    if (Meteor.isClient) {
      return Meteor.subscribe(medicationPublications.medicationAdmin);
    }
    return null;
  }

}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const Medications = new MedicationCollection();
