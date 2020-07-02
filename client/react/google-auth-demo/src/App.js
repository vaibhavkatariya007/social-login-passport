/* global gapi */
import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isSignedIn: false,
    };
  }

  componentDidMount() {
    const successCallback = this.onSuccess.bind(this);

    window.gapi.load('auth2', () => {
      this.auth2 = gapi.auth2.init({
        client_id:
          '1051210915239-0165kkdc4ujaoi0uu1fcgu34ugn36g8l.apps.googleusercontent.com',
      });

      // this.auth2.attachClickHandler(document.querySelector('#loginButton'), {}, this.onLoginSuccessful.bind(this))

      this.auth2.then(() => {
        this.setState({
          isSignedIn: this.auth2.isSignedIn.get(),
        });
      });
    });

    window.gapi.load('signin2', function () {
      // Method 3: render a sign in button
      // using this method will show Signed In if the user is already signed in
      var opts = {
        width: 200,
        height: 50,
        client_id:
          '1051210915239-0165kkdc4ujaoi0uu1fcgu34ugn36g8l.apps.googleusercontent.com',
        onsuccess: successCallback,
      };
      gapi.signin2.render('loginButton', opts);
    });
  }

  onSuccess(googleUser) {
    debugger;
    console.log('Logged in as: ' + googleUser.getBasicProfile().getName());
    // post to api
    const token = googleUser.getAuthResponse(
      window.gapi.auth2
        .getAuthInstance()
        .currentUser.get()
        .getAuthResponse(true)
    );
    console.log('access_token ', token);
    this.setState({
      isSignedIn: true,
      err: null,
    });
  }

  onLoginFailed(err) {
    debugger;
    this.setState({
      isSignedIn: false,
      error: err,
    });
  }

  getContent() {
    console.log('isSignedIn::', this.state.isSignedIn);
    if (this.state.isSignedIn) {
      return <p>hello user, you're signed in </p>;
    } else {
      return (
        <div>
          <p>You are not signed in. Click here to sign in.</p>
          <button id="loginButton">Login with Google</button>
        </div>
      );
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Sample App.</h2>

          {this.getContent()}
        </header>
      </div>
    );
  }
}

export default App;
