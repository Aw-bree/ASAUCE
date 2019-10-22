import React from 'react';
import { Link } from 'react-router-dom';

class NavToolbar extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if (this.props.currentUser) {
      this.props.fetchOrder(this.props.currentUser.currentOrderId);
    }
  }

  render() {
    const display = this.props.currentUser ? (
      <section className="account-dropdown">
        <ul className="account-dropdown--auth">
          <p className="account-dropdown--auth--user">{`Hello ${this.props.currentUser.first_name}`}</p>
          <button className="account-dropdown--auth--logout" onClick={this.props.logout}>Sign Out</button>
        </ul>
        <ul className="account-dropdown--options">
          <p className="account-dropdown--option">
            <svg xmlns="http://www.w3.org/2000/svg" height='21' width='21' viewBox="0 0 20 20" focusable="false">
              <path d='M14 6a4 4 0 1 0-8 0 4 4 0 0 0 8 0zm2 0A6 6 0 1 1 4 6a6 6 0 0 1 12 0zm-6 9c-3.068 0-5.67 1.223-7.035 3h14.07c-1.365-1.777-3.967-3-7.035-3zm10 5H0c.553-4.006 4.819-7 10-7s9.447 2.994 10 7z' fill='23fff' />
            </svg>
            My Account
          </p>
          <a href={`#/orders/${this.props.currentUser.currentOrderId}`} >
            <p id="orders-link" className="account-dropdown--option">
              <svg xmlns="http://www.w3.org/2000/svg" height='21' width='21' viewBox="0 0 20 20">
                <path d='M18 4.667L16 2H4L2 4.667V18h16V4.667zM0 4l3-4h14l3 4v16H0V4z' fill='23fff' fill='232D2D2D' fillRule='evenodd' />
                <path d='M0 4h20v2H0z' />
                <path d='M9 1.111h2v4H9z' fillRule='nonzero' />
              </svg>
              My Orders
            </p>
          </a>
          <p className="account-dropdown--option">
            <svg xmlns="http://www.w3.org/2000/svg" height='21' width='21' viewBox="0 0 20 20">
              <path fill='%23fff' fill='%232D2D2D' d='M9.7 13l1.8 1.5-1.436 1.5L6 12l4-4 1.5 1.5L9.7 11H20v9H0V3.605L3 0h14l3 3.605V9h-2V6H2v12h16v-5H9.7zM2.5 4H9V2H4L2.5 4zm15 0L16 2h-5v2h6.5z' />
            </svg>
            Returns Information
          </p>
          <p className="account-dropdown--option-last">
            <svg xmlns="http://www.w3.org/2000/svg" height='21' width='21' viewBox="0 0 20 20">
              <path fill='%230770cf' fill='%230770cf' fillRule='evenodd' d='M4.667 14h11.339c1.1 0 1.994-.9
              1.994-2.009V4.01A2.003 2.003 0 0 0 16.006 2H3.994C2.894 2 2 2.9 2 4.009V16l2.667-2zm.666 2L0 20V4.009A4.002 4.002 0 0 1
              3.994 0h12.012C18.215 0 20 1.8 20 4.009v7.982A4.002 4.002 0 0 1 16.006 16H5.333z' />
              <path fillRule='nonzero' d='M6
              8.333c-.552 0-1-.373-1-.833 0-.46.448-.833 1-.833S7 7.04 7 7.5c0 .46-.448.833-1 .833zm4 0c-.552 0-1-.373-1-.833
              0-.46.448-.833 1-.833s1 .373 1 .833c0 .46-.448.833-1 .833zm4 0c-.552 0-1-.373-1-.833 0-.46.448-.833 1-.833s1 .373 1
              .833c0 .46-.448.833-1 .833z' />
            </svg>
            Contact Preferences
          </p>
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
          <p className="account-dropdown--option">
            <svg xmlns="http://www.w3.org/2000/svg" height='21' width='21' viewBox="0 0 20 20" focusable="false">
              <path d='M14 6a4 4 0 1 0-8 0 4 4 0 0 0 8 0zm2 0A6 6 0 1 1 4 6a6 6 0 0 1 12 0zm-6 9c-3.068 0-5.67 1.223-7.035 3h14.07c-1.365-1.777-3.967-3-7.035-3zm10 5H0c.553-4.006 4.819-7 10-7s9.447 2.994 10 7z' fill='23fff' />
            </svg>
            My Account
          </p>
          <p className="account-dropdown--option">
            <svg xmlns="http://www.w3.org/2000/svg" height='21' width='21' viewBox="0 0 20 20">
              <path d='M18 4.667L16 2H4L2 4.667V18h16V4.667zM0 4l3-4h14l3 4v16H0V4z' fill='23fff' fill='232D2D2D' fillRule='evenodd' />
              <path d='M0 4h20v2H0z' />
              <path d='M9 1.111h2v4H9z' fillRule='nonzero' />
            </svg>
            My Orders
          </p>
          <p className="account-dropdown--option">
            <svg xmlns="http://www.w3.org/2000/svg" height='21' width='21' viewBox="0 0 20 20">
              <path fill='%23fff' fill='%232D2D2D' d='M9.7 13l1.8 1.5-1.436 1.5L6 12l4-4 1.5 1.5L9.7 11H20v9H0V3.605L3 0h14l3 3.605V9h-2V6H2v12h16v-5H9.7zM2.5 4H9V2H4L2.5 4zm15 0L16 2h-5v2h6.5z' />
            </svg>
            Returns Information
          </p>
          <p className="account-dropdown--option-last">
            <svg xmlns="http://www.w3.org/2000/svg" height='21' width='21' viewBox="0 0 20 20">
              <path fill='%230770cf' fill='%230770cf' fillRule='evenodd' d='M4.667 14h11.339c1.1 0 1.994-.9
              1.994-2.009V4.01A2.003 2.003 0 0 0 16.006 2H3.994C2.894 2 2 2.9 2 4.009V16l2.667-2zm.666 2L0 20V4.009A4.002 4.002 0 0 1
              3.994 0h12.012C18.215 0 20 1.8 20 4.009v7.982A4.002 4.002 0 0 1 16.006 16H5.333z' />
              <path fillRule='nonzero' d='M6
              8.333c-.552 0-1-.373-1-.833 0-.46.448-.833 1-.833S7 7.04 7 7.5c0 .46-.448.833-1 .833zm4 0c-.552 0-1-.373-1-.833
              0-.46.448-.833 1-.833s1 .373 1 .833c0 .46-.448.833-1 .833zm4 0c-.552 0-1-.373-1-.833 0-.46.448-.833 1-.833s1 .373 1
              .833c0 .46-.448.833-1 .833z' />
            </svg>
            Contact Preferences
          </p>
        </ul>
      </section>
    );

    return (
      <section className="toolbar" >
        <ul className="toolbar--business">
          <a class-name="auth--logo" href="#/"><svg className="toolbar--business--logo" width="104" height="30" viewBox="0 0 104 30" role="img" aria-labelledby="home-logo"><title id="home-logo">ASOS logo, back to the Home Page</title><path fill="#FFF" fillRule="evenodd" d="M71.83 21.983c-1.558 1.666-3.56 2.51-5.95 2.51-2.387 0-4.39-.844-5.947-2.51-1.488-1.587-2.343-4.124-2.343-6.96 0-2.766.864-5.27 2.37-6.867 1.572-1.667 3.565-2.516 5.92-2.523 2.36.007 4.35.856 5.924 2.523 1.506 1.598 2.37 4.1 2.37 6.867 0 2.836-.855 5.373-2.343 6.96zm-20.915-6.96c0 .128.005.255.008.38-2.39-2.166-5.845-2.974-7.957-3.394-3.907-.82-6.89-1.58-6.89-4.35 0-1.96 1.757-3.38 5.132-3.14 3.085.224 4.384 2.102 4.74 3.914.05.3.19.515.53.517l5.547.05c.026 0 .048-.003.072-.004-.783 1.816-1.182 3.84-1.182 6.015zM41.48 25.19c-2.683 0-5.64-.95-6.32-4.624-.06-.35-.225-.496-.495-.503l-5.364-.07v-9.446c.71 2.768 3.04 4.684 8.09 5.816 3.38.806 9.24 1.318 9.24 4.774 0 2.408-1.78 4.11-5.15 4.054zm-26.714-.69c-4.327 0-8.29-3.394-8.29-9.47 0-4.77 2.97-9.39 8.32-9.39 2.315 0 8.188.79 8.188 9.39 0 8.62-6.132 9.47-8.218 9.47zm65.922-11.792c1.232 1.636 3.453 2.848 7.063 3.657 3.38.805 9.25 1.318 9.25 4.775 0 2.403-1.78 4.11-5.15 4.05-2.68 0-5.64-.95-6.32-4.625-.052-.35-.22-.497-.49-.504L80.06 20c.523-1.54.79-3.21.79-4.974 0-.793-.056-1.566-.16-2.317zM91.474 30c5.95 0 12.965-2.208 12.416-9.366-.606-6.355-7.244-7.964-10.562-8.625-3.907-.82-6.892-1.58-6.892-4.35 0-1.96 1.758-3.38 5.134-3.14 3.084.224 4.384 2.102 4.74 3.914.05.3.19.515.53.517l5.546.048c.422.002.554-.216.5-.516C101.8 1.874 96.246 0 91.133 0 86.03 0 79.88 1.43 79.443 7.754c-.015.246-.02.486-.02.722-.814-1.683-1.985-3.23-3.495-4.597C73.142 1.37 69.666.03 65.878 0h-.127c-1.81 0-3.58.333-5.26.99a15.26 15.26 0 0 0-4.65 2.888c-1.43 1.295-2.56 2.747-3.36 4.327C51.27 1.822 45.81 0 40.77 0 36.084 0 30.517 1.208 29.3 6.305v-5.06a.49.49 0 0 0-.49-.488h-5.224c-.27 0-.49.22-.49.49V2.61c0 .23-.155.31-.343.175-1.858-1.34-4.607-2.782-7.915-2.782-1.86 0-3.635.326-5.277.968-1.64.65-3.2 1.63-4.64 2.92C3.29 5.37 2.05 7.05 1.23 8.9.417 10.742 0 12.807 0 15.027 0 17.1.367 19.043 1.088 20.8c.722 1.756 1.82 3.382 3.267 4.83 1.446 1.45 3.063 2.553 4.804 3.276 1.74.722 3.66 1.09 5.7 1.09 3.51 0 6.15-1.493 7.88-2.85.19-.144.342-.067.342.17v1.435c0 .27.22.49.49.49H28.8c.27 0 .49-.22.49-.49v-4.83C31.766 29.7 38.04 30 41.113 30c5.137 0 11.06-1.647 12.234-6.7.55.818 1.192 1.597 1.924 2.33 2.8 2.807 6.47 4.316 10.62 4.362h.17c1.97 0 3.87-.377 5.648-1.12a14.82 14.82 0 0 0 4.79-3.242 15.25 15.25 0 0 0 2.594-3.43c1.86 7.438 9.035 7.8 12.387 7.8z"></path></svg></a>          
          <a href="#/products/search?Business=4021" className="toolbar--busienss--item">WOMEN</a>
          <li className="toolbar--busienss--item">MEN</li>
        </ul>
        <form className="toolbar--search">
        </form>
        <ul className="toolbar--profile">
          <li className="toolbar--profile--icons">
            <svg id="account-dropdown-button" className="toolbar--profile-icon" xmlns="http://www.w3.org/2000/svg" height='19' width='19' viewBox="0 0 20 20" focusable="false">
              <path d='M14 6a4 4 0 1 0-8 0 4 4 0 0 0 8 0zm2 0A6 6 0 1 1 4 6a6 6 0 0 1 12 0zm-6 9c-3.068 0-5.67 1.223-7.035 3h14.07c-1.365-1.777-3.967-3-7.035-3zm10 5H0c.553-4.006 4.819-7 10-7s9.447 2.994 10 7z' fill='white' />
            </svg>
            {display}
             
            <svg xmlns="http://www.w3.org/2000/svg" className="toolbar--profile-icon" height='19' width='19' viewBox="0 0 20 20" focusable="false">
              <path d='M10.618 15.474a21.327 21.327 0 0 0 3.137-2.076c2.697-2.166 4.249-4.619 4.245-7.299-.003-2.284-1.757-4.101-3.881-4.099-1.016 0-1.97.417-2.69 1.158l-1.43 1.467-1.432-1.463a3.748 3.748 0 0 0-2.695-1.151C3.749 2.013 1.998 3.837 2 6.12c.003 2.677 1.559 5.123 4.256 7.281a21.32 21.32 0 0 0 3.756 2.39c.191-.096.394-.202.606-.318zM9.996 1.763l.203-.2A5.726 5.726 0 0 1 14.116 0c3.246-.004 5.88 2.725 5.884 6.097C20.01 13.845 10.014 18 10.014 18S.01 13.87 0 6.124C-.003 2.752 2.624.014 5.87.01a5.733 5.733 0 0 1 3.92 1.554l.205.199z' fill='white' />
            </svg>

            <svg xmlns="http://www.w3.org/2000/svg" className="toolbar--profile-icon" height='19' width='19' viewBox="0 0 20 20" focusable="false">
              <path d='M18 17.987V7H2v11l16-.013zM4.077 5A5.996 5.996 0 0 1 10 0c2.973 0 5.562 2.162 6.038 5H20v14.986L0 20V5h4.077zm9.902-.005C13.531 3.275 11.86 2 10 2 8.153 2 6.604 3.294 6.144 4.995c.92 0 7.654.03 7.835 0z' fill='white' />
            </svg>
          </li>

          <div className={this.props.orderItemsCount > 0 ? "full-bag" : "empty-bag"}>
            <p className={this.props.orderItemsCount > 0 ? "full-bag-count" : "empty-bag-count"}>{this.props.orderItemsCount}</p>
          </div>
            
        </ul>
      </section>
    )
  }
}

export default NavToolbar;
