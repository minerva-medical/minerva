import React from 'react';
import { Divider, Grid, Header, Button } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';

class LandingPage extends React.Component {
  render() {
    return (
        <div className="landing-center">
          <Grid container centered>
            <Header className="landing-text" as="h1">MINERVA MEDICAL</Header>
          </Grid>
          <Divider section hidden/>
          <Grid columns={2} verticalAlign="top" textAlign="center" container>
            <Grid.Column>
              <Button size="massive" as={NavLink} activeClassName="" exact to="/signup" key='signup' inverted
                      style={{ font: 'Lato' }}>REGISTER</Button>
            </Grid.Column>
            <Grid.Column>
              <Button size="massive" as={NavLink} activeClassName="" exact to="/signin" key='signin' inverted
                      style={{ font: 'Lato' }}>LOGIN</Button>
            </Grid.Column>
          </Grid>
        </div>
    );
  }
}

export default LandingPage;
