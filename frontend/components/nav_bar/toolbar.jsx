import React from 'react';
import { Link } from 'react-router-dom';

class Toolbar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const display = this.props.currentUser ? (
      <section className="account-dropdown">
        <ul className="account-dropdown--auth">
          <p className="account-dropdown--auth--user">{`Hello ${this.props.currentUser.first_name}`}</p>
          <button className="account-dropdown--auth--logout" onClick={this.props.logout}>Sign Out</button>
        </ul>
        <ul className="account-dropdown--options">
          <p className="account-dropdown--option">My Account</p>
          <a href={`#/orders/${this.props.currentUser.currentOrderId}`} ><p className="account-dropdown--option">My Orders</p></a>
          <p className="account-dropdown--option">Returns Information</p>
          <p className="account-dropdown--option-last">Contact Preferences</p>
        </ul>
      </section>
    ) : (
        <section className="account-dropdown">
          <ul className="account-dropdown--auth">
            <p className="account-dropdown--auth--auth-links"><Link to="/signup">Sign Up</Link></p>
            <p className="account-dropdown--auth--auth-seperator">|</p>
            <p className="account-dropdown--auth--auth-links"><Link to="/login">Log In</Link></p>
          </ul>
          <ul className="account-dropdown--options">
            <p className="account-dropdown--option">My Account</p>
            <p className="account-dropdown--option">My Orders</p>
            <p className="account-dropdown--option">Returns Information</p>
            <p className="account-dropdown--option-last">Contact Preferences</p>
          </ul>
        </section>
    );

    return (
      <section className="toolbar" >
        <ul className="toolbar--business">
          <a class-name="auth--logo" href="#/"><svg className="toolbar--business--logo" width="104" height="30" viewBox="0 0 104 30" role="img" aria-labelledby="home-logo"><title id="home-logo">ASOS logo, back to the Home Page</title><path fill="#FFF" fillRule="evenodd" d="M71.83 21.983c-1.558 1.666-3.56 2.51-5.95 2.51-2.387 0-4.39-.844-5.947-2.51-1.488-1.587-2.343-4.124-2.343-6.96 0-2.766.864-5.27 2.37-6.867 1.572-1.667 3.565-2.516 5.92-2.523 2.36.007 4.35.856 5.924 2.523 1.506 1.598 2.37 4.1 2.37 6.867 0 2.836-.855 5.373-2.343 6.96zm-20.915-6.96c0 .128.005.255.008.38-2.39-2.166-5.845-2.974-7.957-3.394-3.907-.82-6.89-1.58-6.89-4.35 0-1.96 1.757-3.38 5.132-3.14 3.085.224 4.384 2.102 4.74 3.914.05.3.19.515.53.517l5.547.05c.026 0 .048-.003.072-.004-.783 1.816-1.182 3.84-1.182 6.015zM41.48 25.19c-2.683 0-5.64-.95-6.32-4.624-.06-.35-.225-.496-.495-.503l-5.364-.07v-9.446c.71 2.768 3.04 4.684 8.09 5.816 3.38.806 9.24 1.318 9.24 4.774 0 2.408-1.78 4.11-5.15 4.054zm-26.714-.69c-4.327 0-8.29-3.394-8.29-9.47 0-4.77 2.97-9.39 8.32-9.39 2.315 0 8.188.79 8.188 9.39 0 8.62-6.132 9.47-8.218 9.47zm65.922-11.792c1.232 1.636 3.453 2.848 7.063 3.657 3.38.805 9.25 1.318 9.25 4.775 0 2.403-1.78 4.11-5.15 4.05-2.68 0-5.64-.95-6.32-4.625-.052-.35-.22-.497-.49-.504L80.06 20c.523-1.54.79-3.21.79-4.974 0-.793-.056-1.566-.16-2.317zM91.474 30c5.95 0 12.965-2.208 12.416-9.366-.606-6.355-7.244-7.964-10.562-8.625-3.907-.82-6.892-1.58-6.892-4.35 0-1.96 1.758-3.38 5.134-3.14 3.084.224 4.384 2.102 4.74 3.914.05.3.19.515.53.517l5.546.048c.422.002.554-.216.5-.516C101.8 1.874 96.246 0 91.133 0 86.03 0 79.88 1.43 79.443 7.754c-.015.246-.02.486-.02.722-.814-1.683-1.985-3.23-3.495-4.597C73.142 1.37 69.666.03 65.878 0h-.127c-1.81 0-3.58.333-5.26.99a15.26 15.26 0 0 0-4.65 2.888c-1.43 1.295-2.56 2.747-3.36 4.327C51.27 1.822 45.81 0 40.77 0 36.084 0 30.517 1.208 29.3 6.305v-5.06a.49.49 0 0 0-.49-.488h-5.224c-.27 0-.49.22-.49.49V2.61c0 .23-.155.31-.343.175-1.858-1.34-4.607-2.782-7.915-2.782-1.86 0-3.635.326-5.277.968-1.64.65-3.2 1.63-4.64 2.92C3.29 5.37 2.05 7.05 1.23 8.9.417 10.742 0 12.807 0 15.027 0 17.1.367 19.043 1.088 20.8c.722 1.756 1.82 3.382 3.267 4.83 1.446 1.45 3.063 2.553 4.804 3.276 1.74.722 3.66 1.09 5.7 1.09 3.51 0 6.15-1.493 7.88-2.85.19-.144.342-.067.342.17v1.435c0 .27.22.49.49.49H28.8c.27 0 .49-.22.49-.49v-4.83C31.766 29.7 38.04 30 41.113 30c5.137 0 11.06-1.647 12.234-6.7.55.818 1.192 1.597 1.924 2.33 2.8 2.807 6.47 4.316 10.62 4.362h.17c1.97 0 3.87-.377 5.648-1.12a14.82 14.82 0 0 0 4.79-3.242 15.25 15.25 0 0 0 2.594-3.43c1.86 7.438 9.035 7.8 12.387 7.8z"></path></svg></a>          
          <li className="toolbar--busienss--item">WOMEN</li>
          <li className="toolbar--busienss--item">MEN</li>
        </ul>
        <form className="toolbar--search">
        </form>
        <ul className="toolbar--profile">
          <li className="toolbar--profile--icons">
              <i className="fa fa-user" id="account-dropdown-button"></i>
              <i className="fa fa-heart" aria-hidden="true"></i>
              <i className="fa fa-shopping-bag" aria-hidden="true"></i>
          </li>
          {display}
        </ul>
      </section>
    )
  }
}

export default Toolbar;
