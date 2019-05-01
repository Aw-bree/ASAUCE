import React from 'react';

export default () => (
  <div className="toolbar" >
    <ul className="business">
      <li>asos</li>
      <li>WOMEN</li>
      <li>MEN</li>
    </ul>
    <form className="search-bar">
      <input type="text" value="search text"/>
      <button>
        <i class="fa fa-search" aria-hidden="true"></i>
      </button>
    </form>
    <ul className="profile-icons">
      <i class="fa fa-user" aria-hidden="true"></i>
      <i class="fa fa-heart-o" aria-hidden="true"></i>
      <i class="fa fa-shopping-bag" aria-hidden="true"></i>
    </ul>
  </div>
);