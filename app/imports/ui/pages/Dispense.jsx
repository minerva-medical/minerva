import React from 'react';
import { Grid, Header, Form, Button, Container, Loader } from 'semantic-ui-react';
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
    };
    this.unitOptions = [
      { key: '0', text: 'tabs', value: 'tabs' },
      { key: '1', text: 'mL', value: 'mL' },
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
        <Container id='dispense-form'>
          <Header as="h2">
            <Header.Content>
              Dispense from Inventory Form
              <Header.Subheader>
                Please input the following information to dispense from the inventory,
                to the best of your abilities.
              </Header.Subheader>
            </Header.Content>
          </Header>
          <Form onSubmit={this.submit}>
            <Grid>
              {/* dispense info */}
              <Grid.Row>
                <Grid.Column width={6}>
                  <Form.Input type="date" label='Date Dispensed' inline name='dateDispensed' onChange={this.handleChange} value={this.state.dateDispensed}/>
                </Grid.Column>
                <Grid.Column width={5}>
                  <Form.Input label='Dispensed To' inline name='dispensedTo' onChange={this.handleChange} value={this.state.dispensedTo}/>
                  <Form.Input label='Dispensed By' inline name='dispensedFrom' onChange={this.handleChange} value={this.state.dispensedFrom}/>
                </Grid.Column>
                <Grid.Column width={5}>
                  <Form.Select label='Site' inline options={this.getOptions('site')} name='site' onChange={this.handleChange} value={this.state.site}/>
                </Grid.Column>
              </Grid.Row>
              {/* drug info */}
              <Grid.Row>
                <Grid.Column width={6}>
                  <Form.Select label='Drug Name' inline options={this.getOptions('drug')} name='drug' onChange={this.handleChange} value={this.state.drug}/>
                </Grid.Column>
                <Grid.Column width={5}>
                  <Form.Select label='Lot Number' inline options={this.getOptions('lotId')} name='lotId' onChange={this.handleChange} value={this.state.lotId}/>
                  <Form.Input type='date' label='Expiration Date' inline name='expire' onChange={this.handleChange} value={this.state.expire}/>
                </Grid.Column>
                <Grid.Column width={5}>
                  <Form.Select label='Brand' inline options={this.getOptions('brand')} name='brand' onChange={this.handleChange} value={this.state.brand}/>
                  <Form.Group>
                    <Form.Input type='number' min={1} label='Quantity' inline name='quantity' onChange={this.handleChange} value={this.state.quantity}/>
                    <Form.Select className='unit-select' options={this.unitOptions} />
                  </Form.Group>
                </Grid.Column>
              </Grid.Row>
            </Grid>
            <div className='buttons-div'>
              <Button type='submit'>Submit</Button>
            </div>
          </Form>
        </Container>
    );
  }
}

/** Require an array of Stuff documents in the props. */
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
