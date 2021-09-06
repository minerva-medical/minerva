import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Button, Container, Header, Message, Segment } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';

/** After the user clicks the "Signout" link in the NavBar, log them out and display this page. */
export default class Signout extends React.Component {
  render() {
    Meteor.logout();
    return (
       <div className='signOutPage' id='sign-out-page'>
         <Segment style={{ padding: '8em 0em' }} vertical>
           <Container text>
             <i style={{ fontSize: '1.33em' }}>You have successfully signed out.</i>
             <Header as='h3' style={{ fontSize: '9.5em' }}>MINERVA</Header>
             <p style={{ textAlign: 'right', fontSize: '1.7em' }}><i>Come Back Soon!</i></p>
             <Button.Group>
               <Button as={NavLink} activeClassName="" exact to="/" key='landing' color="black" size='huge'>
                 HOME
               </Button>
               <Button as={NavLink} activeClassName="" exact to="/signin" key='signin' color="white" size='huge'
                       basic inverted>LOGIN</Button>
             </Button.Group>
           </Container>
         </Segment>
       </div>
    );
  }
}
