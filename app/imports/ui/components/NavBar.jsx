import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter, NavLink } from 'react-router-dom';
import { Menu, Dropdown, Header, Icon } from 'semantic-ui-react';

// import { Roles } from 'meteor/alanning:roles';

/** The NavBar appears at the top of every page. Rendered by the App Layout component. */
class NavBar extends React.Component {
  render() {
    const menuStyle = { marginBottom: '30px', backgroundColor: '#1D3E66', backgroundSize: 'content' };
    return (
        <Menu style={menuStyle} attached="top" borderless inverted>
          <Menu.Item as={NavLink} activeClassName="" exact to="/">
            <Header inverted as='h1'>MINERVA</Header>
          </Menu.Item>
          {this.props.currentUser ? (
              [
                <Menu.Item as={NavLink} activeClassName="active" exact to="/addinventory" key='add'> Add to
                  Inventory<Icon name='plus'/></Menu.Item>,
                <Menu.Item as={NavLink} activeClassName="active" exact to="/dispense" key='dispense'>
                  Dispense Inventory<Icon name="pills"/></Menu.Item>,
                <Menu.Item as={NavLink} activeClassName="active" exact to="/status" key='status'>
                  Inventory Status</Menu.Item>,
                <Menu.Item as={NavLink} activeClassName="active" exact to="/dispenseLog" key='dispenseLog'>
                  Dispense Log</Menu.Item>]
          ) : ''}
          {this.props.currentUser === '' ? (
              <Menu.Item position="right">
                <Dropdown text="Login" pointing="top right" icon={'user'}>
                  <Dropdown.Menu>
                    <Dropdown.Item icon="user" text="Sign In" as={NavLink} exact to="/signin"/>
                    <Dropdown.Item icon="add user" text="Sign Up" as={NavLink} exact to="/signup"/>
                  </Dropdown.Menu>
                </Dropdown>
              </Menu.Item>
          ) : (
              <Menu.Menu position="right" attached="top" borderless inverted>
                <Menu.Item>
                  <Menu.Item key='current-user'>
                    <Icon name="user doctor"/>{this.props.currentUser}
                  </Menu.Item>
                  <Dropdown pointing="top right" icon={'sign out'}>
                    <Dropdown.Menu>
                      <Dropdown.Item icon="sign out" text="Sign Out" as={NavLink} exact to="/signout"/>
                    </Dropdown.Menu>
                  </Dropdown>
                </Menu.Item>
              </Menu.Menu>
          )}
        </Menu>
    );
  }
}

/** Declare the types of all properties. */
NavBar.propTypes = {
  currentUser: PropTypes.string,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
const NavBarContainer = withTracker(() => ({
  currentUser: Meteor.user() ? Meteor.user().username : '',
}))(NavBar);

/** Enable ReactRouter for this component. https://reacttraining.com/react-router/web/api/withRouter */
export default withRouter(NavBarContainer);
