import React from 'react';

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

  render() {
    return (
    <div className="session-form">
      <section className="header">
        <img src="" height="28" width="95" alt="ASOS logo"></img>
      </section>

      <section className="register-info">
        <section className="register-options">
          <p className="signin-option">NEW TO ASOS?</p>
          <a href="" className="login-option-redirect">Already registered?</a>
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
            />
          </label>
          <button onClick={this.handleSubmit}>Sign In</button>
        </form>
        <p>Forgot password?</p>
      </main>

      <hr className="hr-text"></hr>
      <div className="hr-text">or</div>

      <section className="register-helpers">
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
      </section>
    </div>
    );
  }
};

export default Login;