import React, { Component } from 'react';
import { hashHistory, withRouter, Link } from 'react-router';
import request from 'superagent';
import cookie from 'react-cookie';

const propTypes = {
  children: React.PropTypes.element,
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: null,
    };
    this.logIn = this.logIn.bind(this);
    this.signUp = this.signUp.bind(this);
    this.signOut = this.signOut.bind(this);
  }
  componentDidMount() {
    this.updateAuth();
  }
  signOut() {
    request.post('/api/signout')
           .then(() => {
             this.updateAuth();
             hashHistory.push('/');
           });
  }
  updateAuth() {
    this.setState({
      token: cookie.load('token'),
    });
  }
  logIn(userDetails) {
    request.post('/api/login')
           .send(userDetails)
           .then(() => {
             this.updateAuth();
             hashHistory.push('/profile');
           });
  }
  signUp(userDetails) {
    request.post('/api/signup')
           .send(userDetails)
           .then(() => {
             this.updateAuth();
             hashHistory.push('/profile');
           });
  }
  render() {
    let userDisplayElement;
    if (this.state.token) {
      userDisplayElement = (
        <div className="top-nav_links">
          <button onClick={this.signOut} >Logout</button>
          <Link to="/profile" id="profile"><button>Go to my Profile</button></Link>
        </div>
        );
    } else {
      userDisplayElement = (
        <div className="top-nav_links">
        <Link to="/signup" id="signup">Sign up</Link>
          <Link to="/login" id="login">Login</Link>
        </div>
      );
    }
    const childrenWithProps = React.cloneElement(this.props.children, {
      token: this.state.token,
      handleLogin: this.logIn,
      handleSignup: this.signUp,
      handleSignout: this.signOut,
    });
    return (
      <div>
        <div className="top-nav">
          <Link to="/"><img className="trailericon" src="trailerparklogo.png" alt="trailerparklogo" /></Link>
          {userDisplayElement}
        </div>
        {childrenWithProps}
      </div>
    );
  }
}

App.propTypes = propTypes;

export default withRouter(App);
