import React from 'react';
import PropTypes from 'prop-types';
import { Link, Redirect } from 'react-router-dom';
import { Container, Form, Grid, Header, Message, Segment, Button } from 'semantic-ui-react';
import { Accounts } from 'meteor/accounts-base';
import { NavLink } from 'react-router-dom';

/**
 * Signup component is similar to signin component, but we create a new user instead.
 */
class Signup extends React.Component {
  /** Initialize state fields. */
  constructor(props) {
    super(props);
    this.state = { email: '', password: '', error: '', redirectToReferer: false };
  }

  /** Update the form controls each time the user interacts with them. */
  handleChange = (e, { name, value }) => {
    this.setState({ [name]: value });
  }

  /** Handle Signup submission. Create user account and a profile entry, then redirect to the home page. */
  submit = () => {
    const { email, password } = this.state;
    Accounts.createUser({ email, username: email, password }, (err) => {
      if (err) {
        this.setState({ error: err.reason });
      } else {
        this.setState({ error: '', redirectToReferer: true });
      }
    });
  }

  /** Display the signup form. Redirect to add page after successful registration and login. */
  render() {
    const { from } = this.props.location.state || { from: { pathname: '/add' } };
    // if correct authentication, redirect to from: page instead of signup screen
    if (this.state.redirectToReferer) {
      return <Redirect to={from}/>;
    }
    return (
      <div className="body-signup">
      <div className="container-sign" id="container">
      <div className="form-container sign-up-container">
        <Form onSubmit={this.submit}>
          <h1 className="h1-signup">Create Account</h1>
          <Segment stacked>
          <span>or use your email for registration</span>
          <Form.Field>
            <Form.Input type="username" name="username" placeholder="Username"  onChange={this.handleChange}/>
          </Form.Field>
          <Form.Field>
            <Form.Input type="email" name="email" placeholder="Email"  onChange={this.handleChange}/>
          </Form.Field>
          <Form.Field>
            <Form.Input type="password" name="password" placeholder="Password"  onChange={this.handleChange}/>
          </Form.Field>
          <Form.Button id="signup-form-submit" content="Submit"/>
          </Segment>
        </Form>
      </div> 
      <div className="overlay-container">
        <div className="overlay">
          <div className="overlay-panel overlay-left">
            <h1 className="h1-signup">Welcome Back!</h1>
            <p>To keep connected with us please login with your personal info</p>
            <button className="ghost button-signup" id="signUp">Sign Up</button>
          </div>
          <div className="overlay-panel overlay-right">
            <h1>Aloha, Friend!</h1>
            <p>Already have a registered account?</p>
            <Button inverted className="ghost button-signup" id="signIn" as={NavLink} activeClassName="" exact to="/signin" key="signin">LOGIN</Button>
          </div>
        </div>
      </div>
                  {this.state.error === '' ? (
              ''
            ) : (
              <Message
                error
                header="Registration was not successful"
                content={this.state.error}
              />
            )}
      </div>
    </div>
    );
  }
}

/** Ensure that the React Router location object is available in case we need to redirect. */
Signup.propTypes = {
  location: PropTypes.object,
};

export default Signup;
