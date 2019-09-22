import React from 'react';
import { withRouter } from 'react-router-dom';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
    };
    
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInput(type) {
    return (e) => {
      this.setState({ [type]: e.target.value });
    };
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.login({email: 'demo@gmail.com', password: 'password'})
      .then(() => this.props.history.push('/'));
  }

  renderErrors() {

    let errs = this.props.errors.map((error, i) => (
      <li className="auth--form-error" key={i}>{error}</li>
    ));

    if (errs.length === 0) {
      return (
        <div></div>
      )
    } 

    return (
      <ul className="auth--login--form-errors">
        {errs}
      </ul>
    );
  }

  render() {
    return (
      <section className="auth">
        <ul className="auth--container">
          <section className="auth--header">
            <a className="auth--logo" href="#/"><img src="https://66.media.tumblr.com/a1f4e385d907cf5bdc70bf919143ca2d/tumblr_pqt9m9O3uK1wyb2l8o1_100.png" height="28" width="95" alt="ASOS logo"></img></a>
          </section>

          <section className="auth--form-container">
            <section className="auth--register">
              <ul className="auth--register--options">
                <a href="#/signup" className="auth--register--not-selected-left">NEW TO ASOS?</a>
                <p className="auth--register--selected-right">ALREADY REGISTERED?</p>
              </ul>
            </section>

            <main className="auth--form--main">
              
              <h2 className="auth--title">SIGN IN WITH EMAIL</h2>
              
              <form className="auth--login-form">
                {this.renderErrors()}
                <label className="auth--form-label">EMAIL ADDRESS:
                  <input className="auth--form-input"
                    type="text"
                    value={this.state.email}
                    onChange={this.handleInput('email')}
                  />
                </label>
                <label className="auth--form-label">PASSWORD
                  <input className="auth--form-input-password"
                    type="password:"
                    value={this.state.password}
                    onChange={this.handleInput('password')}
                  />
                </label>
                <button className="auth--button" onClick={this.handleSubmit}>Demo</button>
              </form>
              
              {/* <p className="auth--form-password-helper">Forgot password?</p> */}
            </main>
          </section>
        </ul>  
      </section>
    );
  }
};

export default withRouter(Login);