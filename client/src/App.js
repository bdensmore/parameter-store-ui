import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import Auth from "./Auth/Auth";
import Base from "./layouts/base";
import Login from "./login";

import "./App.css";

class App extends Component {
  render() {
    const auth = new Auth();
    return (
      <div>
        <Switch>
          <Route
            path="/"
            exact
            render={() => <Base auth={auth} {...this.props} />}
          />
          <Route
            path="/dashboard"
            exact
            render={() => <Base auth={auth} {...this.props} />}
          />
          <Route path="/login" render={() => <Login auth={auth} />} />
        </Switch>
      </div>
    );
  }
}

export default App;
