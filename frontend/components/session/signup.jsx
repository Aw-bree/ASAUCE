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
      date_of_birth: date,
      gender: 'Female',
      country: 'United States',
      email_lists: []
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
              <p className="selected-register-option-left">NEW TO ASOS?</p>
              <a href="#/login" className="not-selected-register-option-right">Already registered?</a>
            </section>
          </section>

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

          <p className="subtitle">
            Signing up with social is super quick. No extra passwords to remember - no brain fail. Don't worry, we'd never share any of your data or post anything on your behalf #notevil
          </p>
          <hr className="hr-text"></hr>
          <div className="hr-text"></div>
        </section> */}

        
          <main>
            <form class="signin-form">
              <label>EMAIL ADDRESS:
                <input
                  type="text"
                  value={this.state.email}
                  onChange={this.handleInput('email')}
                />
              </label>
              <label>FIRST NAME:
                <input
                  type="text"
                  value={this.state.first_name}
                  onChange={this.handleInput('first_name')}
                />
              </label>
              <label>LAST NAME:
                <input
                  type="text"
                  value={this.state.last_name}
                  onChange={this.handleInput('last_name')}
                />
              </label>
              <label>PASSWORD
                <input
                  type="password"
                  value={this.state.password}
                  onChange={this.handleInput('password')}
                />
              </label>
            
              {/* fieldset adapted from http://html.cita.illinois.edu/nav/form/date/index.php?example=6 */}
              <fieldset className="date-of-birth"> 
                <legend>DATE OF BIRTH </legend> 
                <label>DD
                  <select name="day" > 
                    <option>1</option>       
                    <option>2</option>       
                    <option>3</option>       
                    <option>4</option>       
                    <option>5</option>       
                    <option>6</option>       
                    <option>7</option>       
                    <option>8</option>       
                    <option>9</option>       
                    <option>10</option>       
                    <option>11</option>       
                    <option>12</option>       
                    <option>13</option>       
                    <option>14</option>       
                    <option>15</option>       
                    <option>16</option>       
                    <option>17</option>       
                    <option>18</option>       
                    <option>19</option>       
                    <option>20</option>       
                    <option>21</option>       
                    <option>22</option>       
                    <option>23</option>       
                    <option>24</option>       
                    <option>25</option>       
                    <option>26</option>       
                    <option>27</option>       
                    <option>28</option>       
                    <option>29</option>       
                    <option>30</option>       
                    <option>31</option>
                  </select>
                </label>

                <label>Month
                  <select name="month" > 
                    <option>January</option>       
                    <option>February</option>       
                    <option>March</option>       
                    <option>April</option>       
                    <option>May</option>       
                    <option>June</option>       
                    <option>July</option>       
                    <option>August</option>       
                    <option>September</option>       
                    <option>October</option>       
                    <option>November</option>       
                    <option>December</option> 
                  </select>  
                </label>          
                
                <label>YYYY
                  <select name="year" > 
                    <option>2019</option>       
                    <option>2018</option>       
                    <option>2017</option>       
                    <option>2016</option>       
                    <option>2015</option>       
                    <option>2014</option>       
                    <option>2013</option>       
                    <option>2012</option>       
                    <option>2011</option>       
                    <option>2010</option> 
                    <option>2009</option>
                    <option>2008</option>
                    <option>2007</option>
                    <option>2006</option>
                    <option>2005</option>
                    <option>2004</option>
                    <option>2003</option>
                    <option>2002</option>
                    <option>2001</option>
                    <option>2000</option>
                    <option>1999</option>
                    <option>1998</option>
                    <option>1997</option>
                    <option>1996</option>
                    <option>1995</option>
                    <option>1994</option>
                    <option>1993</option>
                    <option>1992</option>
                    <option>1991</option>
                    <option>1990</option>
                    <option>1989</option>
                    <option>1988</option>
                    <option>1987</option>
                    <option>1986</option>
                    <option>1985</option>
                    <option>1984</option>
                    <option>1983</option>
                    <option>1982</option>
                    <option>1981</option>
                    <option>1980</option>
                    <option>1979</option>
                    <option>1978</option>
                    <option>1977</option>
                    <option>1976</option>
                    <option>1975</option>
                    <option>1974</option>
                    <option>1973</option>
                    <option>1972</option>
                    <option>1971</option>
                    <option>1970</option>
                    <option>1969</option>
                    <option>1968</option>
                    <option>1967</option>
                    <option>1966</option>
                    <option>1965</option>
                    <option>1964</option>
                    <option>1963</option>
                    <option>1962</option>
                    <option>1961</option>
                    <option>1960</option>
                    <option>1959</option>
                    <option>1958</option>
                    <option>1957</option>
                    <option>1956</option>
                    <option>1955</option>
                    <option>1954</option>
                    <option>1953</option>
                    <option>1952</option>
                    <option>1951</option>
                    <option>1950</option>
                    <option>1949</option>
                    <option>1948</option>
                    <option>1947</option>
                    <option>1946</option>
                    <option>1945</option>
                    <option>1944</option>
                    <option>1943</option>
                    <option>1942</option>
                    <option>1941</option>
                    <option>1940</option>
                    <option>1939</option>
                    <option>1938</option>
                    <option>1937</option>
                    <option>1936</option>
                    <option>1935</option>
                    <option>1934</option>
                    <option>1933</option>
                    <option>1932</option>
                    <option>1931</option>
                    <option>1930</option>   
                  </select> 
                </label>
                <p>You need to be 16 or over to use ASOS</p> 
              </fieldset>

              {/* <fieldset className="gender">
                <legend>GENDER: </legend> 
                <input type="radio" name="gender" value="female" checked /> Girl
                <input type="radio" name="gender" value="male" /> Guy
              </fieldset> */}

               {/* <fieldset className="gender">
                <legend>CONTACT PREFERENCES</legend> 
                  <div className="contact-pref-header">
                    <p>Tell us which emails you’d like:</p> */}
                    {/* # button check source https://www.includehelp.com/code-snippets/javascript-select-unselect-check-unckecck-all-checkboxes.aspx */}
                    {/* <button className="checkbox-all">
                    </button>
                  </div>
                <input type="checkbox" name="discounts" checked /> Discounts and sales
                <input type="checkbox" name="new" checked /> New stuff
                <input type="checkbox" name="exclusives" checked /> Your exclusives
                <input type="checkbox" name="partners" checked /> ASOS partners
              </fieldset> */}
              {/* <ul>
                <li>Tell me more about these...</li>
                <li>By creating your account, you agree to our Terms and Conditions & Privacy Policy</li>
              </ul> */}
              <button onClick={this.handleSubmit}>JOIN ASOS</button>
              {this.renderErrors()}
            </form>
          </main>
        </div>
      </div>
    );
  }
};

export default withRouter(Signup);