import React from 'react';
import { Header, Form, Container, Loader, Table, Popup, Segment, Divider, Dropdown,
  Pagination, Icon, Grid } from 'semantic-ui-react';
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
class DispenseLog extends React.Component {
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
    };
    this.unitOptions = [
      { key: '0', text: 'tabs', value: 'tabs' },
      { key: '1', text: 'mL', value: 'mL' },
    ];
    this.reasonOptions = [
      { key: '0', text: '', value: '' },
      { key: '1', text: 'Patient Use', value: 'Patient Use' },
      { key: '2', text: 'Expired', value: 'Expired' },
      { key: '3', text: 'Broken/Contaminated', value: 'Broken/Contaminated' },
      { key: '4', text: 'Lost', value: 'Lost' },
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

    const limitOptions = [
      { key: '0', value: '10', text: '10' },
      { key: '1', value: '25', text: '25' },
      { key: '2', value: '50', text: '50' },
      { key: '3', value: '100', text: '100' },
    ];

    const brand = [
      { key: '0', value: 'All', text: 'All' },
      { key: '1', value: 'Tylenol', text: 'Tylenol' },
      { key: '2', value: 'Advil', text: 'Advil' },
      { key: '3', value: 'Generic', text: 'Generic' },
    ];

    const type = [
      { key: '0', value: 'All', text: 'All' },
      { key: '1', value: 'Allergy & Cold Medicines', text: 'Allergy & Cold Medicines' },
      { key: '2', value: 'Analgesics/Anti-inflammatory', text: 'Analgesics/Anti-inflammatory' },
      { key: '3', value: 'Antihypertensives', text: 'Antihypertensives' },
    ];

    return (
        <Container id='inventory-status' text style={{ marginTop: '1em' }}>
          <Header as="h2">
            <Header.Content>
              History Dispense Log
              <Header.Subheader>
                <i>Below is a history log of dispensed inventories.</i>
              </Header.Subheader>
            </Header.Content>
          </Header>
          <Segment text style={{ marginTop: '1em' }}>
            <Grid>
              <React.Fragment>
                <Grid.Column width={8}>
                  <Form>
                    <Form.Group>
                      <Form.Field>
                        <Popup
                            trigger={
                              <Form.Input floated={'right'}
                                          placeholder={'Enter a filter.'}
                                          name={'filter'}
                                          label={'Filter'}
                                          icon={'search'}
                              />
                            }
                            positon={'right center'}
                        />
                      </Form.Field>
                    </Form.Group>
                  </Form>
                </Grid.Column>
                <Grid.Column width={15}>
                  Brand: {' '}
                  <Dropdown
                      inline={true}
                      options={brand}
                      defaultValue={'All'}
                  />
                  Type: {' '}
                  <Dropdown
                      inline={true}
                      options={type}
                      defaultValue={'All'}
                  />
                </Grid.Column>
              </React.Fragment>
            </Grid>
            <Divider/>
            <React.Fragment>
              Records per page:{' '}
              <Dropdown
                  inline={true}
                  options={limitOptions}
                  defaultValue={'25'}
              />
              Total count: {'200'}
              <Table celled selectable sortable>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell
                        width={1}
                    >
                      #
                    </Table.HeaderCell>
                    <Table.HeaderCell
                        width={3}
                    >
                      Brand
                    </Table.HeaderCell>
                    <Table.HeaderCell
                        width={3}
                    >
                      Type
                    </Table.HeaderCell>
                    <Table.HeaderCell
                        width={3}
                    >
                      Medicine
                    </Table.HeaderCell>
                    <Table.HeaderCell
                        width={1}
                    >
                      Quantity
                    </Table.HeaderCell>
                    <Table.HeaderCell
                        width={1}
                    >
                      Status
                    </Table.HeaderCell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>1</Table.Cell>
                    <Table.Cell>Tylenol</Table.Cell>
                    <Table.Cell>Analgesics/Anti-inflammatory</Table.Cell>
                    <Table.Cell>Acetaminophen 500 mg Caps</Table.Cell>
                    <Table.Cell>60</Table.Cell>
                    <Table.Cell textAlign='center'>
                      <Icon color='green' name='circle'/>
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>2</Table.Cell>
                    <Table.Cell>Tylenol</Table.Cell>
                    <Table.Cell>Analgesics/Anti-inflammatory</Table.Cell>
                    <Table.Cell>Acetaminophen 160mg/5 ml Susp</Table.Cell>
                    <Table.Cell>2</Table.Cell>
                    <Table.Cell textAlign='center'>
                      <Icon color='yellow' name='circle'/>
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>3</Table.Cell>
                    <Table.Cell>Tylenol</Table.Cell>
                    <Table.Cell>Analgesics/Anti-inflammatory</Table.Cell>
                    <Table.Cell>Acetaminophen Infant Drops</Table.Cell>
                    <Table.Cell>0</Table.Cell>
                    <Table.Cell textAlign='center'>
                      <Icon color='red' name='circle'/>
                    </Table.Cell>
                  </Table.Row>
                </Table.Header>
                <Table.Footer>
                  <Table.Row>
                    <Table.HeaderCell colSpan="8">
                      <Pagination
                          totalPages={10}
                          activePage={1}
                      />
                    </Table.HeaderCell>
                  </Table.Row>
                </Table.Footer>
              </Table>
            </React.Fragment>
          </Segment>
        </Container>
    );
  }
}

/** Require an array of Stuff documents in the props. */
DispenseLog.propTypes = {
  drugs: PropTypes.array.isRequired,
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
    sites: Sites.find({}).fetch(),
    drugs: Drugs.find({}).fetch(),
    lotIds: LotIds.find({}).fetch(),
    brands: Brands.find({}).fetch(),
    ready: siteSub.ready() && drugSub.ready() && lotIdSub.ready() && brandSub.ready(),
  };
})(DispenseLog);