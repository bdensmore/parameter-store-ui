import React, { Component } from "react";

class Login extends Component {
  handleSubmit = e => {
    e.preventDefault();
    let data = new FormData(e.target);
    this.props.auth.login(data);
  };

  render() {
    return (
      <div className="sign-in">
        <form className="form-signin" onSubmit={this.handleSubmit}>
          <h1 className="h3 mb-3 font-weight-normal">Please sign in</h1>
          <label htmlFor="aws_access_key" className="sr-only">
            Access Key ID
          </label>
          <input
            type="text"
            id="aws_access_key"
            name="aws_access_key"
            className="form-control"
            placeholder="Access Key ID"
            required
            autoFocus
          />
          <label htmlFor="aws_secret_key" className="sr-only">
            Secret Key
          </label>
          <input
            type="password"
            id="aws_secret_key"
            name="aws_secret_key"
            className="form-control"
            placeholder="Secret Key"
            required
          />
          <label htmlFor="region" className="sr-only">
            Region
          </label>
          <select name="aws_region" className="form-control">
            <option value="us-east-1" defaultValue="us-east-1">
              us-east-1
            </option>
          </select>
          <br />
          <button className="btn btn-lg btn-primary btn-block" type="submit">
            Sign in
          </button>
        </form>
      </div>
    );
  }
}

export default Login;
