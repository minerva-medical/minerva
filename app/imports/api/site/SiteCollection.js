import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
// import { check } from 'meteor/check';
// import { _ } from 'meteor/underscore';
// import { Roles } from 'meteor/alanning:roles';
import BaseCollection from '../base/BaseCollection';

export const sitePublications = {
  site: 'Site',
  siteAdmin: 'SiteAdmin',
};

class SiteCollection extends BaseCollection {
  constructor() {
    super('Sites', new SimpleSchema({
      site: String,
    }));
  }

  /**
   * Defines a new Site item.
   * @param name the name of the item.
   * @return {String} the docID of the new document.
   */
  define({ site }) {
    const docID = this._collection.insert({
      site,
    });
    return docID;
  }

  /**
   * Default publication method for entities.
   * It publishes the entire collection for admin and just the site associated to an owner.
   */
  publish() {
    if (Meteor.isServer) {
      // get the SiteCollection instance.
      const instance = this;
      /** This subscription publishes only the documents associated with the logged in user */
      Meteor.publish(sitePublications.site, function publish() {
        if (this.userId) {
          return instance._collection.find();
        }
        return this.ready();
      });

      /** This subscription publishes all documents regardless of user, but only if the logged in user is the Admin. */
      Meteor.publish(sitePublications.siteAdmin, function publish() {
        if (this.userId) {
          return instance._collection.find();
        }
        return this.ready();
      });
    }
  }

  /**
   * Subscription method for site owned by the current user.
   */
  subscribeSite() {
    if (Meteor.isClient) {
      return Meteor.subscribe(sitePublications.site);
    }
    return null;
  }

  /**
   * Subscription method for admin users.
   * It subscribes to the entire collection.
   */
  subscribeSiteAdmin() {
    if (Meteor.isClient) {
      return Meteor.subscribe(sitePublications.siteAdmin);
    }
    return null;
  }

}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const Sites = new SiteCollection();
