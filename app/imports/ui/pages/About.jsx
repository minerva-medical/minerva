import React from 'react';
import { Grid, Header } from 'semantic-ui-react';

/** A simple static component to render some text for the about page. */
class About extends React.Component {
  render() {
    return (

      <Grid container centered>
        <Grid.Column width={12}>
          <Header as="h2" textAlign="center">
            <p>About Us</p>
          </Header>
          <p>Minerva Medical is a project for ICS 414 at UH Manoa, the project page can be seen
            <a href="https://minerva-medical.github.io" target='_blank' rel='noreferrer'> here </a>
            or in the footer below. The application will keep track of supply inventory for the Medical Outreach Clinic.
            The Medical Outreach Clinic (or H.O.M.E project) helps provide medical care to residents around the island
            by means of a a mobile clinic.</p>
        </Grid.Column>

        <Grid.Column width={5}>
          <Header as="h4" textAlign="center">
            <a href="https://github.com/minerva-medical" target='_blank' rel='noreferrer'>
              Our GitHub Organization</a>
          </Header>
        </Grid.Column>
        <Grid.Column width={5}>
          <Header as="h4" textAlign="center">
            <a href="https://sites.google.com/view/hawaiihomeproject/about?authuser=0"
               target='_blank' rel='noreferrer'>The Hawaii H.O.M.E Project</a>
          </Header>
        </Grid.Column>
      </Grid>
    );
  }
}

export default About;
