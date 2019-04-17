import history from "../history";
import axios from "axios";

class Auth {
  login = params => {
    axios
      .post(`${process.env.REACT_APP_API_URL}/login`, params)
      .then(response => {
        const data = response.data;
        this.setToken(data.token);
      })
      .catch(error => {
        alert("Invalid credentials!");
        history.replace("/login");
      });
  };

  logout = () => {
    localStorage.removeItem("token");
    history.replace("/login");
  };

  handleAuthentication = () => {
    if (!this.isAuthenticated()) {
      history.replace("/login");
    }
  };

  isAuthenticated = () => {
    if (localStorage.getItem("token")) {
      return true;
    } else {
      return false;
    }
  };

  setToken = token => {
    localStorage.setItem("token", token);
    history.replace("/dashboard");
    // localStorage.setItem('expires_in', JSON.stringify((expires_in * 1000) + new Date().getTime()));
    // localStorage.setItem('created_on', created_on);
  };

  checkTokenExpired = () => {
    let todaysDate = new Date().getTime();
    return todaysDate < localStorage.getItem("expires_in");
  };
}

export default Auth;
