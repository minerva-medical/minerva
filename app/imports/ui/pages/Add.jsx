import React from 'react';
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

/** Renders the Page for Dispensing Inventory. */
class Add extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      site: undefined,
      location: undefined,
      dateAdded: new Date().toISOString().slice(0, 10),
      drug: undefined,
      donor: undefined,
      quantity: undefined,
      brand: undefined,
      lotId: undefined,
      expire: undefined,
      addType: undefined,
      addedBy: undefined,
      inventoryType: undefined,
      notes: undefined,
    };
    this.unitOptions = [
      { key: '0', text: 'tabs', value: 'tabs' },
      { key: '1', text: 'mL', value: 'mL' },
    ];
    this.addTypeOptions = [
      { key: '0', text: 'Purchased', value: 'Purchased' },
      { key: '1', text: 'Donated', value: 'Donated' },
    ];
    this.invenType = [
      { key: '0', text: '', value: '' },
      { key: '1', text: 'Medication', value: 'Medication' },
      { key: '2', text: 'Vaccination', value: 'Vaccination' },
      { key: '3', text: 'Patient Supplies', value: 'Patient Supplies' },
      { key: '4', text: 'Lab Testing Supplies', value: 'Lab Testing Supplies' },
    ];
  }

  /** TODO: cleaner logic? */
  componentDidUpdate() {
    if (this.state.addedBy === undefined && Meteor.user()) {
      this.setState({ addedBy: Meteor.user().username });
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
    const options = _.pluck(this.props[`${name}s`], name);
    return options.map(elem => ({
      key: elem,
      text: elem,
      value: elem,
    }));
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
              Add to Inventory Form
              <Header.Subheader>
                <i>Please input the following information to add to the inventory,
                  to the best of your abilities, to help us keep track of stock for records.</i>
              </Header.Subheader>
            </Header.Content>
          </Header>
          <Form onSubmit={this.submit}>
            <Segment text style={{ marginTop: '1em' }}>
              {/* dispense info */}
              <Grid columns='equal'>
                <Grid.Row>
                  <Grid.Column>
                    <Form.Input type="date" label='Date Added' name='dateDispensed' onChange={this.handleChange}
                                value={this.state.dateAdded}/>
                  </Grid.Column>
                  <Grid.Column>
                    <Form.Input label='Added By' name='addedBy' onChange={this.handleChange}
                                value={this.state.addedBy}/>
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column>
                    <Form.Select label='Add Type' name='addType' options={this.addTypeOptions}
                                 placeholder="Purchased / Donated"
                                 value={this.state.addType}/>
                  </Grid.Column>
                  <Grid.Column>
                    <Form.Input label='Donor Name (if applicable)' name='donor'
                                placeholder="Company Name / Organization Name"
                                options={this.addTypeOptions} value={this.state.donor}/>
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column>
                    <Form.Select label='Inventory Type' name='inventoryType'
                                 placeholder="Medication / Vaccination / Patient Supplies / Lab Testing Supplies"
                                 onChange={this.handleChange} value={this.state.inventoryType}
                                 options={this.invenType}/>
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column>
                    <Form.Select label='Site' options={this.getOptions('site')} name='site'
                                 placeholder="POST, Kaka’ako, etc."
                                 onChange={this.handleChange} value={this.state.site}/>
                  </Grid.Column>
                  <Grid.Column>
                    <Form.Select label='Stored Location' options={this.getOptions('location')} name='location'
                                 onChange={this.handleChange} value={this.state.location}/>
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  {/* drug info */}
                  <Grid.Column>
                    <Form.Select label='Drug Name' options={this.getOptions('drug')} name='drug'
                                 onChange={this.handleChange} value={this.state.drug}/>
                  </Grid.Column>
                  <Grid.Column>
                    <Form.Select label='Lot Number' options={this.getOptions('lotId')} name='lotId'
                                 onChange={this.handleChange} value={this.state.lotId}/>
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column>
                    <Form.Input type='date' label='Expiration Date' name='expire' onChange={this.handleChange}
                                value={this.state.expire}/>
                  </Grid.Column>
                  <Grid.Column>
                    <Form.Select label='Brand' options={this.getOptions('brand')} name='brand'
                                 onChange={this.handleChange} value={this.state.brand}/>
                  </Grid.Column>
                  <Grid.Column>
                    <Form.Group>
                      <Form.Input type='number' width={10} min={1} label='Quantity' name='quantity'
                                  onChange={this.handleChange} value={this.state.quantity}/>
                      <Form.Select label='Unit' className='unit-select' options={this.unitOptions} width={4} fluid/>
                    </Form.Group>
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column>
                   <Form.Input label='Additional Notes'control='textarea' rows={2} onChange={this.handleChange} value={this.state.notes}> </Form.Input>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Segment>
            <div className='buttons-div'>
              <Button type='submit' text style={{ marginTop: '1em' }} color="red" size='medium' inverted>Clear
                Fields</Button>
              <Button type='submit' text style={{ marginTop: '1em' }} color="green" size='medium'
                      floated="right">Submit</Button>
            </div>
          </Form>
        </Container>
    );
  }
}
/** Require an array of Stuff documents in the props. */
Add.propTypes = {
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

})(Add);
