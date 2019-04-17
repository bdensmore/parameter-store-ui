import React, { Component } from "react";

class Navbar extends Component {
  logout = () => {
    this.props.auth.logout();
  };

  render() {
    return (
      <nav className="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0">
        <a className="navbar-brand col-sm-3 col-md-2 mr-0" href="">
          Parameter Store App
        </a>
        <input
          className="form-control form-control-dark w-100"
          type="text"
          placeholder="Search"
          aria-label="Search"
          onKeyUp={this.props.searchFunc}
        />
        <ul className="navbar-nav px-3">
          <li className="nav-item text-nowrap">
            <a className="nav-link" href="" onClick={this.logout}>
              Sign out
            </a>
          </li>
        </ul>
      </nav>
    );
  }
}

export default Navbar;
