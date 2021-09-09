import React from 'react';
// import { Grid, Image } from 'semantic-ui-react';
import LandingPage from '../components/LandingPage';

/** A simple static component to render some text for the landing page. */
class Landing extends React.Component {
  render() {
    return (
      <div className="landingPage">
        <LandingPage/>
      </div>
    );
  }
}

export default Landing;
