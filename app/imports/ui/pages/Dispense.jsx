import React, { useState } from 'react';
import { Grid, Header, Form, Button, Container, Loader, Segment } from 'semantic-ui-react';
// import swal from 'sweetalert';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { _ } from 'meteor/underscore';
import { Sites } from '../../api/site/SiteCollection';
import { Drugs } from '../../api/drug/DrugCollection';
import { LotIds } from '../../api/lotId/LotIdCollection';
import { Brands } from '../../api/brand/BrandCollection';

/** convert array to dropdown options */
const getOptions = (arr, name) => {
  let options = _.pluck(arr, name);
  options = options.map(elem => ({
    key: elem,
    text: elem,
    value: elem,
  }));
  if (name === 'site') {
    options.push({ key: 'OTHER', text: 'OTHER', value: 'OTHER' });
  }
  return options;
};

/** On submit, insert the data. */
const submit = event => {
  event.preventDefault();
  // TODO: handle submit
  console.log('submitted');
};

/** Renders the Page for Dispensing Inventory. */
const Dispense = (props) => {
  const [site, setSite] = useState('');
  const [newSite, setNewSite] = useState('');
  const [dateDispensed, setDateDispensed] = useState(new Date().toISOString().slice(0, 10));
  const [drug, setDrug] = useState('');
  const [quantity, setQuantity] = useState(NaN);
  const [brand, setBrand] = useState('');
  const [lotId, setLotId] = useState('');
  const [expire, setExpire] = useState('');
  const [dispensedTo, setDispensedTo] = useState('');
  const [dispensedFrom, setDispensedFrom] = useState('');

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
        <Form onSubmit={submit}>
          <Segment text style={{ marginTop: '1em' }}>
            {/* dispense info */}
            <Grid columns='equal' >
              <Grid.Row>
                <Grid.Column>
                  <Form.Input type="date" label='Date Dispensed' name='dateDispensed'
                              onChange={(e, { value }) => setDateDispensed(value)} value={dateDispensed}/>
                </Grid.Column>
                <Grid.Column>
                  <Form.Input label='Dispensed By' name='dispensedFrom'
                              onChange={(e, { value }) => setDispensedFrom(value)}
                              value={dispensedFrom || props.currentUser.username}/>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column>
                  <Form.Select label='Inventory Type' name='inventoryType'
                               placeholder="Medication / Vaccination / Patient Supplies / Lab Testing Supplies"
                               options={getOptions(props.types, 'type')} clearable />
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column>
                  <Form.Select label='Reason for Dispense' name='reasonDispense'
                               placeholder="Patient Use / Expired / Broken / Lost"
                               options={getOptions(props.reasons, 'reason')} clearable />
                </Grid.Column>
                <Grid.Column>
                  <Form.Input label='Dispensed To' placeholder="Patient's First Name, Last Name"
                              name='dispensedTo' onChange={(e, { value }) => setDispensedTo(value)}
                              value={dispensedTo}/>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column>
                  <Form.Select clearable label='Site' options={getOptions(props.sites, 'site')}
                               placeholder="POST, Kaka’ako, etc."
                               name='site' onChange={(e, { value }) => setSite(value)} value={site}/>
                  {
                    site === 'OTHER' &&
                    <Form.Input name='newSite' onChange={(e, { value }) => setNewSite(value)} value={newSite}/>
                  }
                </Grid.Column>
                {/* drug info */}
                <Grid.Column>
                  <Form.Select clearable label='Drug Name' options={getOptions(props.drugs, 'drug')}
                               name='drug' onChange={(e, { value }) => setDrug(value)} value={drug}/>
                </Grid.Column>
                <Grid.Column>
                  <Form.Select clearable label='Lot Number' options={getOptions(props.lotIds, 'lotId')}
                               name='lotId' onChange={(e, { value }) => setLotId(value)} value={lotId}/>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column>
                  <Form.Input type='date' label='Expiration Date'
                              name='expire' onChange={(e, { value }) => setExpire(value)} value={expire}/>
                </Grid.Column>
                <Grid.Column>
                  <Form.Select clearable label='Brand' options={getOptions(props.brands, 'brand')}
                               name='brand' onChange={(e, { value }) => setBrand(value)} value={brand}/>
                </Grid.Column>
                <Grid.Column>
                  <Form.Group>
                    <Form.Input type='number' width={10} min={1} label='Quantity'
                                name='quantity' onChange={(e, { value }) => setQuantity(value)} value={quantity}/>
                    <Form.Select label='Unit' className='unit-select'
                                 options={getOptions(props.units, 'unit')} width={4} fluid/>
                  </Form.Group>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column>
                  <Form.TextArea label='Additional Notes' />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Segment>
          <div className='buttons-div'>
            <Button type='submit' text style={{ marginTop: '1em' }}
                    color="red" size='medium' inverted>Clear Fields</Button>
            <Button type='submit' text style={{ marginTop: '1em' }}
                    color="green" size='medium' floated="right" >Submit</Button>
          </div>
        </Form>
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
  units: PropTypes.array.isRequired,
  reasons: PropTypes.array.isRequired,
  types: PropTypes.array.isRequired,
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
    units: [{ unit: 'tabs' }, { unit: 'mL' }],
    reasons: [{ reason: 'Patient Use' }, { reason: 'Expired' }, { reason: 'Broken/Contaminated' }, { reason: 'Lost' }],
    // TODO: replace w/ tabs https://react.semantic-ui.com/modules/tab/
    types: [{ type: 'Medication' }, { type: 'Vaccination' }, { type: 'Patient Supplies' },
            { type: 'Lab Testing Supplies' }],
  };
})(Dispense);
