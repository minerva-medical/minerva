import React, { useState } from 'react';
import { Header, Form, Button, Container, Loader, Segment } from 'semantic-ui-react';
import { AutoForm, ErrorsField, NumField, SelectField, TextField, DateField, LongTextField } from 'uniforms-semantic';
import swal from 'sweetalert';
import { Meteor } from 'meteor/meteor';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2'; // required for Uniforms
import SimpleSchema from 'simpl-schema';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { _ } from 'meteor/underscore';
import { Sites } from '../../api/site/SiteCollection';
import { Drugs } from '../../api/drug/DrugCollection';
import { LotIds } from '../../api/lotId/LotIdCollection';
import { Brands } from '../../api/brand/BrandCollection';

/** Create a schema to specify the structure of the data to appear in the form. */
const getSchema = (props) => {
  const schema = new SimpleSchema({
    site: {
      type: String,
      allowedValues: _.pluck(props.sites, 'site'),
    },
    dateDispensed: {
      type: Date,
      defaultValue: new Date(),
    },
    drug: {
      type: String,
      allowedValues: _.pluck(props.drugs, 'drug'),
    },
    quantity: Number,
    brand: {
      type: String,
      allowedValues: _.pluck(props.brands, 'brand'),
    },
    lotId: {
      type: String,
      allowedValues: _.pluck(props.lotIds, 'lotId'),
    },
    expire: Date,
    dispensedTo: String,
    dispensedBy: {
      type: String,
      defaultValue: props.currentUser.username,
    },
    note: String,
    // TODO: units will be passed from props
    // TODO: move to report Expired/Broken/Contaminated/Lost page
    reason: {
      type: String,
      allowedValues: ['Patient Use', 'Expired', 'Broken/Contaminated', 'Lost'],
    },
    // TODO: type will be made into tabs https://react.semantic-ui.com/modules/tab/
    type: {
      type: String,
      allowedValues: ['Medication', 'Vaccination', 'Patient Supplies', 'Lab Testing Supplies'],
    },
  });

  return new SimpleSchema2Bridge(schema);
};

/** On submit, insert the data. */
const submit = (data, formRef) => {
  const { site, dateDispensed, drug, quantity, brand, lotId, expire, dispensedTo, dispensedBy, note, reason,
    type } = data;
  swal('Success', `${site}, ${dateDispensed}, ${drug}, ${quantity}, ${brand}, ${lotId}, ${expire}
    ${dispensedTo}, ${dispensedBy}, ${note}, ${reason}, ${type}`, 'success');
  formRef.reset();
  // stuffDefineMethod.call({ name, quantity, condition, owner },
  //   (error) => {
  //     if (error) {
  //       swal('Error', error.message, 'error');
  //     } else {
  //       swal('Success', 'Item added successfully', 'success');
  //       formRef.reset();
  //     }
  //   });
};

/** Renders the Page for Dispensing Inventory. */
const Dispense = (props) => {
  let fRef = null;

  if (props.ready) {
    return (
      <Container id='dispense-form' text style={{ marginTop: '1em' }}>
        <Header as="h2">
          <Header.Content>
            Dispense from Inventory Form
            <Header.Subheader>
              <i>Please input the following information to dispense from the inventory,
                to the best of your abilities.</i>
            </Header.Subheader>
          </Header.Content>
        </Header>
        <AutoForm ref={ref => { fRef = ref; }} schema={getSchema(props)} onSubmit={data => submit(data, fRef)} >
          <Segment>
            <Form.Group widths='equal'>
              <DateField name='dateDispensed'/>
              <TextField name='dispensedBy'/>
            </Form.Group>
            <SelectField name='type' placeholder="Medication / Vaccination / Patient Supplies / Lab Testing Supplies"/>
            <Form.Group widths='equal'>
              <SelectField name='reason' placeholder='Patient Use / Expired / Broken / Lost'/>
              <TextField name='dispensedTo' placeholder="Patient's First Name, Last Name"/>
            </Form.Group>
            <Form.Group widths='equal'>
              <SelectField name='site' placeholder='POST, Kaka’ako, etc.'/>
              <SelectField name='drug'/>
              <SelectField name='lotId'/>
            </Form.Group>
            <Form.Group widths='equal'>
              <DateField name='expire'/>
              <SelectField name='brand'/>
              <NumField name='quantity' decimal={false}/>
              {/* TODO: disabled unit field */}
            </Form.Group>
            <LongTextField name='note'/>
            <ErrorsField/>
          </Segment>
        </AutoForm>
        <div className='buttons-div'>
          <Button content='Reset' style={{ marginTop: '1em' }}
                  color="red" size='medium' inverted onClick={() => fRef.reset()}/>
          <Button content='Submit' style={{ marginTop: '1em' }}
                  color="green" size='medium' floated="right" onClick={() => fRef.submit()}/>
        </div>
      </Container>
    );
  }
  return (<Loader active>Getting data</Loader>);
};

/** Require an array of Stuff documents in the props. */
Dispense.propTypes = {
  currentUser: PropTypes.object.isRequired,
  sites: PropTypes.array.isRequired,
  drugs: PropTypes.array.isRequired,
  lotIds: PropTypes.array.isRequired,
  brands: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(() => {
  const siteSub = Sites.subscribeSite();
  const drugSub = Drugs.subscribeDrug();
  const lotIdSub = LotIds.subscribeLotId();
  const brandSub = Brands.subscribeBrand();
  return {
    currentUser: Meteor.user(),
    sites: Sites.find({}).fetch(),
    drugs: Drugs.find({}).fetch(),
    lotIds: LotIds.find({}).fetch(),
    brands: Brands.find({}).fetch(),
    ready: siteSub.ready() && drugSub.ready() && lotIdSub.ready() && brandSub.ready(),
  };
})(Dispense);
