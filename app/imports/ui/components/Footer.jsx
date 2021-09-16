import React from 'react';
import { Header } from 'semantic-ui-react';

/** The Footer appears at the bottom of every page. Rendered by the App Layout component. */
class Footer extends React.Component {
  render() {
    const divStyle = {
      paddingTop: '15px',
      backgroundColor: '#1D3E66',
      color: 'white',
      padding: '40px 100px 40px 100px',
      marginTop: '15px',
    };
    return (
        <footer>
          <div style={divStyle} className="ui center aligned container fluid">
            <hr/>
            <Header inverted as='h3'>Designed by Minerva Medical</Header>
            <a style={{ color: 'lightblue' }} href="https://minerva-medical.github.io" target='_blank' rel='noreferrer'>
              Our Project Page</a>
          </div>
        </footer>
    );
  }
}

export default Footer;
