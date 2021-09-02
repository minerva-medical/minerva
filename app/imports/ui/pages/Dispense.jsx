import React from 'react';
import { Grid, Header, Form, Checkbox, Button } from 'semantic-ui-react';
import 'uniforms-bridge-simple-schema-2'; // required for Uniforms

/** Renders the Page for Dispensing Inventory. */
class Dispense extends React.Component {

  /** On submit, insert the data. */

  /** Render the form. Use Uniforms: https://github.com/vazco/uniforms */
  render() {
    return (
        <Grid container centered>
          <Grid.Column>
            <Header as="h2" textAlign="center">Dispense from Inventory Form</Header>
            <Form>
              <Form.Group>
              <Form.Field>
                <label>First Name</label>
                <input placeholder='First Name' />
              </Form.Field>
              <Form.Field>
                <label>Last Name</label>
                <input placeholder='Last Name' />
              </Form.Field>
              </Form.Group>
              <Form.Field>
                <Checkbox label='I agree to the Terms and Conditions' />
              </Form.Field>
              <Button type='submit'>Submit</Button>
            </Form>
          </Grid.Column>
        </Grid>
    );
  }
}

export default Dispense;
