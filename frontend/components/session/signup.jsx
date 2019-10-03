import React from 'react';
import { withRouter } from 'react-router-dom';

class Signup extends React.Component {
  constructor(props) {
    super(props);

    let date = new Date();
    this.state = {
      email: '',
      password: '',
      first_name: '',
      last_name: '',
      gender: 'Female',
      country: 'United States'
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInput(type) {
    return (e) => {
      this.setState({ [type]: e.target.value })
    };
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.createNewUser(this.state)
      .then(() => this.props.history.push('/'));
  }

  renderErrors(attribute) {
    let fieldErrors = this.props.errors[attribute];

    if (fieldErrors !== undefined) {
      fieldErrors = fieldErrors.map((error, i) => (
        <li className="auth--form-error" key={i}>{error}</li>
      ));

      return (
        <ul className="auth--form-errors">
          {fieldErrors}
          <div className="arrow-down"></div>
          <div className="arrow-down-2"></div>
        </ul>
      )
    }
  }


  render() {
    return (
      <section className="auth">
        <ul className="auth--container">
          <section className="auth--header">
            <a class-name="auth--logo" href="#/"><img src="https://66.media.tumblr.com/a1f4e385d907cf5bdc70bf919143ca2d/tumblr_pqt9m9O3uK1wyb2l8o1_100.png" height="28" width="95" alt="ASOS logo"></img></a>
          </section>    
          <section className="auth--form-container">
            <section className="auth--register">
              <ul className="auth--register--options">
                <p className="auth--register--selected-left">NEW TO ASOS?</p>
                <a href="#/login" className="auth--register--not-selected-right">ALREADY REGISTERED?</a>
              </ul>
            </section>
            <h2 className="auth--title">SIGN UP USING YOUR EMAIL ADDRESS</h2>
            <main className="auth--form--main--sign-up">     
              <form className="auth--signup-form">
                <label className="auth--form-label">EMAIL ADDRESS:
                {this.renderErrors('email')}
                  <input className="auth--form-input"
                    type="text"
                    value={this.state.email}
                    onChange={this.handleInput('email')}
                  />
                </label>         
                <label className="auth--form-label">FIRST NAME:
                  {this.renderErrors('first_name')}
                  <input className="auth--form-input"
                    type="text"
                    value={this.state.first_name}
                    onChange={this.handleInput('first_name')}
                  />
                </label>             
                <label className="auth--form-label">LAST NAME:
                  {this.renderErrors('last_name')}
                  <input className="auth--form-input"
                    type="text"
                    value={this.state.last_name}
                    onChange={this.handleInput('last_name')}
                  />
                </label>
                <label className="auth--form-label">PASSWORD:
                  {this.renderErrors('password')}   
                  <input className="auth--form-input-password"
                    type="password"
                    value={this.state.password}
                    onChange={this.handleInput('password')}
                  />
                </label>
                {/* <fieldset className="gender">
                  <legend>GENDER: </legend> 
                  <input type="radio" name="gender" value="female" checked /> Girl
                  <input type="radio" name="gender" value="male" /> Guy
                </fieldset> */}
              </form>
              <button className="auth--button" onClick={this.handleSubmit}>JOIN ASOS</button>
            </main>
          </section>
        </ul>
      </section>
    );
  }
};

export default withRouter(Signup);