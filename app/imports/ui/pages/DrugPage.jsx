import React from 'react';
import {
  Container,
  Header,
  Loader,
  Item,
  ItemDescription,
  ItemContent,
  ItemMeta,
  ItemExtra,
  Button, Segment, Grid, GridColumn, List, ListItem, ItemGroup,
} from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Stuffs } from '../../api/stuff/StuffCollection';

/** Renders a table containing all of the Stuff documents. Use <StuffItem> to render each row. */
class DrugPage extends React.Component {

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  /** Render the page once subscriptions have been received. */
  renderPage() {
    const drugBox = {
      backgroundColor: 'white',
      borderRadius: '15px',
      padding: '20px',
      paddingLeft: '50px',
      paddingRight: '50px',
      margin: '10px 135px 10px 135px',
    };
    const notes = {
      backgroundColor: 'lightblue',
      borderRadius: '15px',
      padding: '20px',
      marginTop: '15px',
      marginLeft: '10px',
      marginRight: '-40px',
    };

    return (
        <Container>
          <Header as="h2" textAlign="center">Drug Page</Header>
          <Segment style={drugBox} size='medium'>
            <Grid container divided columns='equal' stackable textAlign='justified'>
              <GridColumn>
                <ItemGroup relaxed>
                  <Item>
                    <ItemContent>
                      <Header as='h2'> Aspirin 81 mg</Header>
                      <ItemMeta>Nonsteroidal anti-inflammatory drug (NSAID)</ItemMeta>
                      <ItemDescription>
                        <List size='large'>
                          <ListItem>Brand: Bayer</ListItem>
                          <ListItem>Lot Number: 123456</ListItem>
                          <ListItem>Expiration Date: 09/16/2021</ListItem>
                          <ListItem>Quantity: 30 tabs</ListItem>
                          <ListItem>Supply: 300</ListItem>
                          <ListItem>Storage Location: Case 4</ListItem>
                          <ListItem>Received: Purchased</ListItem> <br/>
                        </List>
                      </ItemDescription>
                      <ItemExtra>
                        <Button size='medium'>Edit</Button>
                      </ItemExtra>
                    </ItemContent>
                  </Item>
                </ItemGroup>
              </GridColumn>
              <GridColumn>
                <Segment style={notes}>
                  <Container fluid>
                    <ItemGroup>
                      <Item>
                        <ItemContent>
                          <Header as='h3'>Notes</Header>
                          <ItemDescription>To be prescribed to patients that are at risk for myocardial infarction or
                            stroke. Prescribed as take 1 tab daily.
                          </ItemDescription>
                        </ItemContent>
                      </Item>
                    </ItemGroup>
                  </Container>
                </Segment>
              </GridColumn>
            </Grid>
          </Segment>
        </Container>
    );
  }
}

/** Require an array of Stuff documents in the props. */
DrugPage.propTypes = {
  stuffs: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(() => {
  // Get access to Stuff documents.
  const subscription = Stuffs.subscribeStuff();
  return {
    stuffs: Stuffs.find({}).fetch(),
    ready: subscription.ready(),
  };
})(DrugPage);
