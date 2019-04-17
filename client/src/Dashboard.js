import React, { Component } from "react";
import axios from "axios";
import FontAwesome from "react-fontawesome";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  Alert
} from "reactstrap";

class Dashboard extends Component {
  state = {
    showModal: false,
    backdrop: true,
    activePage: 1
  };

  addKey = () => {
    this.setState({ showModal: true });
  };

  handleClose = () => {
    this.setState({ showModal: false });
  };

  handleDelete = keyName => {
    const apiUrl = `${process.env.REACT_APP_API_URL}/destroy/${keyName}`;

    this.setState({
      list: []
    });

    axios
      .post(apiUrl)
      .then(response => {
        this.setState({
          list: response.data
        });
      })
      .catch(error => {
        console.log(`The following error occurred: ${error}`);
      });
  };

  handlePageChange = pageNumber => {
    this.setState({ activePage: pageNumber });
  };

  handleSubmit = evt => {
    evt.preventDefault();
    const apiUrl = `${process.env.REACT_APP_API_URL}/save`;
    let keyName = document.getElementById("key-name").value;
    let keyValue = document.getElementById("key-value").value;
    let formData = new FormData();
    formData.append("key_name", keyName);
    formData.append("key_value", keyValue);
    axios({
      method: "post",
      url: apiUrl,
      data: formData
    })
      .then(response => {
        this.setState({
          list: response.data
        });
        this.toggle();
      })
      .catch(error => {
        document.getElementById(
          "modal-alert"
        ).innerHTML = `The following error occurred: ${error.message}`;
        document.getElementById("modal-alert").className =
          "alert alert-danger show";
      });
  };

  toggle = () => {
    this.setState({
      showModal: !this.state.showModal
    });
  };

  render() {
    return (
      <div>
        <main role="main" className="col-md-9 ml-sm-auto col-lg-10 pt-3 px-4">
          <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom">
            <h1 className="h2">Dashboard</h1>
            <div className="btn-toolbar mb-2 mb-md-0">
              <div className="btn-group mr-2">
                {/* }
                  <button className="btn btn-sm btn-outline-secondary">Share</button>
                  <button className="btn btn-sm btn-outline-secondary">Export</button>
                { */}
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <h2>Keys/Values</h2>
            </div>
            <div className="col-6">&nbsp;</div>
            <div className="col">
              <button className="btn btn-sm btn-primary" onClick={this.addKey}>
                Add New Key
              </button>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <table className="table table-striped table-sm">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Value</th>
                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {this.props.list.response === 200 ? (
                    this.props.list.data.map((data, i) => (
                      <tr key={i}>
                        <td>{data.name}</td>
                        <td>{data.value}</td>
                        <td align="center">
                          <FontAwesome
                            name="trash"
                            tag="i"
                            onClick={() => {
                              this.handleDelete(data.name);
                            }}
                          />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3">
                        Retrieving data... {this.props.list.message}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
        <Modal
          isOpen={this.state.showModal}
          toggle={this.toggle}
          className={this.props.className}
          backdrop={this.state.backdrop}
        >
          <ModalHeader toggle={this.toggle}>
            <Alert color="danger" id="modal-alert" className="hide" />
            Add New Key/Value
          </ModalHeader>
          <ModalBody>
            <Form>
              <FormGroup>
                <Label for="name">Key Name</Label>
                <Input
                  type="text"
                  name="keyName"
                  id="key-name"
                  placeholder="Add Key Name"
                />
              </FormGroup>
              <FormGroup>
                <Label for="value">Key Value</Label>
                <Input
                  type="text"
                  name="keyValue"
                  id="key-value"
                  placeholder="Add Key Value"
                />
              </FormGroup>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.handleSubmit}>
              Save
            </Button>{" "}
            <Button color="secondary" onClick={this.toggle}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default Dashboard;
