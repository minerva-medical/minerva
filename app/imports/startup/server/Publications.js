import { Meteor } from 'meteor/meteor';
import { Stuffs } from '../../api/stuff/StuffCollection';
import { Drugs } from '../../api/drug/DrugCollection';
import { DrugTypes } from '../../api/drugType/DrugTypeCollection';
import { Brands } from '../../api/brand/BrandCollection';
import { LotIds } from '../../api/lotId/LotIdCollection';
import { Locations } from '../../api/location/LocationCollection';
import { Sites } from '../../api/site/SiteCollection';

/** Publish all the collections you need. */
Stuffs.publish();
Drugs.publish();
DrugTypes.publish();
Brands.publish();
LotIds.publish();
Locations.publish();
Sites.publish();

/** Need this for the alanning:roles package */
Meteor.publish(null, function () {
  if (this.userId) {
    return Meteor.roleAssignment.find({ 'user._id': this.userId });
  }
  return this.ready();
});
