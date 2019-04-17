import React, { Component } from "react";
import axios from "axios";
import NavBar from "./navbar";
import Sidebar from "./sidebar";
import Dashboard from "../Dashboard";

class Base extends Component {
  state = {
    list: {},
    newList: {}
  };

  componentDidMount = () => {
    this.props.auth.handleAuthentication();
    const apiUrl = `${process.env.REACT_APP_API_URL}/list`;
    axios
      .get(apiUrl)
      .then(response => {
        this.setState({
          list: response.data,
          newList: response.data
        });
      })
      .catch(error => {
        console.log(error);
      });
  };

  search = e => {
    const filteredData = this.state.list.data.filter(list => {
      return list.name.toLowerCase().indexOf(e.target.value.toLowerCase()) > -1;
    });

    this.setState({
      newList: {
        response: this.state.newList.response,
        message: this.state.newList.message,
        data: filteredData
      }
    });
  };

  render() {
    return (
      <div>
        <NavBar searchFunc={this.search} auth={this.props.auth} />
        <div className="container-fluid">
          <Sidebar />
          <Dashboard list={this.state.newList} />
        </div>
      </div>
    );
  }
}

export default Base;
