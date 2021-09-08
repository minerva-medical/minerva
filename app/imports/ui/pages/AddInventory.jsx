import React from 'react';
import { Grid, Header, Form, Container, Loader, Segment } from 'semantic-ui-react';
import { AutoForm, ErrorsField, NumField, SelectField, SubmitField, TextField } from 'uniforms-semantic';
import swal from 'sweetalert';
import { Meteor } from 'meteor/meteor';
import 'uniforms-bridge-simple-schema-2'; // required for Uniforms
import SimpleSchema from 'simpl-schema';
import { stuffDefineMethod } from '../../api/stuff/StuffCollection.methods';

/** Create a schema to specify the structure of the data to appear in the form. */

/** Renders the Page for adding stuff. */
class AddInventory extends React.Component {

  /** Render the form. Use Uniforms: https://github.com/vazco/uniforms */
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  renderPage() {
    return (
      <Container id='add-form' text style={{ marginTop: '1em' }}>
        <Header as="h2">
          <Header.Content>
            Add to Inventory Form
          </Header.Content>
        </Header>
      </Container>
    );
  }
}

export default AddInventory;
