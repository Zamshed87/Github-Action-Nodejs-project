import React from "react";
import {
  BrowserRouter as Router, Redirect, Route, Switch
} from "react-router-dom";
import LogIn from "../modules/auth/login/Login.jsx";
import VerifyPin from "../modules/auth/verifyPIn/index.jsx";
// import SignUp from "../modules/auth/signup/SignUp.jsx";

const AuthPage = () => {
  return (
    <div>
      <Router>
        <div className="body-inner">
          <Switch>
            <Route exact path="/" component={LogIn} />
            <Route exact path="/verifypin" component={VerifyPin} />
            {/* <Route exact path="/signup" component={SignUp} /> */}
            <Redirect to="/" />
          </Switch>
        </div>
      </Router>
    </div>
  );
};

export default AuthPage;
