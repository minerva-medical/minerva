/*  TECHNICAL DEBT:
 AR-01: file name is in PascalCase, not camelCase
 JS-06: console.log on line 68
 UI-02: not tested to be compatible with mobile devices, grid could be made stackable
 */
import React from 'react';
import { Grid, Header, Form, Button, Container, Loader, Segment } from 'semantic-ui-react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { _ } from 'meteor/underscore';
import { Sites } from '../../api/site/SiteCollection';
import { Drugs } from '../../api/drug/DrugCollection';
import { LotIds } from '../../api/lotId/LotIdCollection';
import { Brands } from '../../api/brand/BrandCollection';

/** Renders the Page for Dispensing Inventory. */
class Dispense extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      site: undefined,
      dateDispensed: new Date().toISOString().slice(0, 10),
      drug: undefined,
      quantity: undefined,
      brand: undefined,
      lotId: undefined,
      expire: undefined,
      dispensedTo: undefined,
      dispensedFrom: undefined,
      inventoryType: undefined,
      newSite: undefined,
    };
    this.unitOptions = [
      { key: '0', text: 'tabs', value: 'tabs' },
      { key: '1', text: 'mL', value: 'mL' },
    ];
    this.reasonOptions = [
      { key: '1', text: 'Patient Use', value: 'Patient Use' },
      { key: '2', text: 'Expired', value: 'Expired' },
      { key: '3', text: 'Broken/Contaminated', value: 'Broken/Contaminated' },
      { key: '4', text: 'Lost', value: 'Lost' },
    ];
    this.invenType = [
      { key: '1', text: 'Medication', value: 'Medication' },
      { key: '2', text: 'Vaccination', value: 'Vaccination' },
      { key: '3', text: 'Patient Supplies', value: 'Patient Supplies' },
      { key: '4', text: 'Lab Testing Supplies', value: 'Lab Testing Supplies' },
    ];
  }

  /** TODO: cleaner logic? */
  componentDidUpdate() {
    if (this.state.dispensedFrom === undefined && Meteor.user()) {
      this.setState({ dispensedFrom: Meteor.user().username });
    }
  }

  /** Update the form controls each time the user interacts with them. */
  handleChange = (e, { name, value }) => {
    this.setState({ [name]: value });
  }

  /** On submit, insert the data. */
  submit = event => {
    event.preventDefault();

    console.log('submitted');
  }

  /** convert array to dropdown options */
  getOptions = name => {
    let options = _.pluck(this.props[`${name}s`], name);
    options = options.map(elem => ({
      key: elem,
      text: elem,
      value: elem,
    }));
    if (name === 'site') {
      options.push({ key: 'OTHER', text: 'OTHER', value: 'OTHER' });
    }
    return options;
  }

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  /** Render the form. */
  renderPage() {
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
          <Form onSubmit={this.submit}>
            <Segment text style={{ marginTop: '1em' }}>
              <Grid columns='equal' >
                <Grid.Row>
                  <Grid.Column>
                    <Form.Input type="date" label='Date Dispensed' name='dateDispensed'
                                onChange={this.handleChange} value={this.state.dateDispensed}/>
                  </Grid.Column>
                  <Grid.Column>
                    <Form.Input label='Dispensed By' name='dispensedFrom'
                                onChange={this.handleChange} value={this.state.dispensedFrom}/>
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column>
                    <Form.Select label='Inventory Type' name='inventoryType'
                                 placeholder="Medication / Vaccination / Patient Supplies / Lab Testing Supplies"
                                 onChange={this.handleChange} value={this.state.inventoryType}
                                 options={this.invenType} clearable />
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column>
                    <Form.Select label='Reason for Dispense' name='reasonDispense'
                                 placeholder="Patient Use / Expired / Broken / Lost"
                                 options={this.reasonOptions} clearable />
                  </Grid.Column>
                  <Grid.Column>
                    <Form.Input label='Dispensed To' placeholder="Patient's First Name, Last Name"
                                name='dispensedTo' onChange={this.handleChange} value={this.state.dispensedTo}/>
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column>
                    <Form.Select clearable label='Site' options={this.getOptions('site')}
                                 placeholder="POST, Kaka’ako, etc."
                                 name='site' onChange={this.handleChange} value={this.state.site}/>
                    {
                      this.state.site === 'OTHER' &&
                      <Form.Input name='newSite' onChange={this.handleChange} value={this.state.newSite}/>
                    }
                  </Grid.Column>
                  {/* drug info */}
                  <Grid.Column>
                    <Form.Select clearable label='Drug Name' options={this.getOptions('drug')}
                                 name='drug' onChange={this.handleChange} value={this.state.drug}/>
                  </Grid.Column>
                  <Grid.Column>
                    <Form.Select clearable label='Lot Number' options={this.getOptions('lotId')}
                                 name='lotId' onChange={this.handleChange} value={this.state.lotId}/>
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column>
                    <Form.Input type='date' label='Expiration Date'
                                name='expire' onChange={this.handleChange} value={this.state.expire}/>
                  </Grid.Column>
                  <Grid.Column>
                    <Form.Select clearable label='Brand' options={this.getOptions('brand')}
                                 name='brand' onChange={this.handleChange} value={this.state.brand}/>
                  </Grid.Column>
                  <Grid.Column>
                    <Form.Group>
                      <Form.Input type='number' width={10} min={1} label='Quantity'
                                  name='quantity' onChange={this.handleChange} value={this.state.quantity}/>
                      <Form.Select label='Unit' className='unit-select'
                                   options={this.unitOptions} width={4} fluid/>
                    </Form.Group>
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column>
                    <Form.TextArea label='Additional Notes' rows={2}
                                onChange={this.handleChange} value={this.state.notes}>
                    </Form.TextArea>
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
}

/** Require an array of Dispense documents in the props. */
Dispense.propTypes = {
  ready: PropTypes.bool.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(() => {
  const siteSub = Sites.subscribeSite();
  const drugSub = Drugs.subscribeDrug();
  const lotIdSub = LotIds.subscribeLotId();
  const brandSub = Brands.subscribeBrand();
  return {
    sites: Sites.find({}).fetch(),
    drugs: Drugs.find({}).fetch(),
    lotIds: LotIds.find({}).fetch(),
    brands: Brands.find({}).fetch(),
    ready: siteSub.ready() && drugSub.ready() && lotIdSub.ready() && brandSub.ready(),
  };
})(Dispense);
