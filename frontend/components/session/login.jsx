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
    this.props.login(this.state)
      .then(() => this.props.history.push('/'));
  }

  renderErrors() {
    let errs = this.props.errors.map((error, i) => (
      <li key={i}>{error}</li>
    ));

    return (
      <ul className="login-errors">
        {errs}
      </ul>
    );
  }

  render() {
    return (
      <div className="session">
        <section className="header">
          <a href="#/"><img src="https://66.media.tumblr.com/a1f4e385d907cf5bdc70bf919143ca2d/tumblr_pqt9m9O3uK1wyb2l8o1_100.png" height="28" width="95" alt="ASOS logo"></img></a>
        </section>

        <div className="session-form">
          <section className="register-info">
            <section className="register-options">
              <a href="#/signup" className="not-selected-register-option">NEW TO ASOS?</a>
              <p className="selected-register-option-right">Already registered?</p>
            </section>
          </section>

          <main>
            <h2>SIGN IN WITH EMAIL</h2>
            <form>
              <label>EMAIL ADDRESS:
                      <input
                  type="text"
                  value={this.state.email}
                  onChange={this.handleInput('email')}
                />
              </label>
              <label>PASSWORD
                      <input
                  type="password"
                  value={this.state.password}
                  onChange={this.handleInput('password')}
                />{this.renderErrors()}
              </label>
              <button onClick={this.handleSubmit}>Sign In</button>
            </form>
            <p id="password">Forgot password?</p>
          </main>

          {/* <hr className="hr-text"></hr>
          <div className="hr-text">or</div> */}

          {/* <section className="register-helpers">
            <p>SIGN IN WITH...</p>
            <section className="options-three-buttons">
              <a href="" className="social-link-facebook">
                <span><img src="" alt="facebook"></img>FACEBOOK</span>
              </a>
              <a href="" className="social-link-google">
                <span><img src="" alt="google"></img>GOOGLE</span>
              </a>
              <a href="" className="social-link-twitter">
                <span><img src="" alt="twitter"></img>TWITTER</span>
              </a>
            </section>
          </section> */}
        </div>
      </div>
    );
  }
};

export default withRouter(Login);