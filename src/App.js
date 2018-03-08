import React, { Component } from 'react';
import Register from "./Containers/Register/Register";
import Login from "./Containers/Login/Login";
import {Route} from "react-router-dom";
import ForgetPassword from "./Containers/ForgetPassword/ForgetPassword";
import ResetPassword from "./Containers/ResetPassword/ResetPassword";

class App extends Component {
  render() {
    return (
      <div>
        <Route exact path='/' component={Register}/>
        <Route  path='/login' component={Login}/>
        <Route path="/forgetpassword" component={ForgetPassword}/>
        <Route path="/resetpassword" component={ResetPassword}/>
        {/* <Route path="/profile" component={UserProfile}/>
        <Route  path='/chat' component={Chat}/>
        <Route path='/register' component={Register}/>
        // <Route path="/resetpassword" component={ResetPassword}/>
        <Route path="/logout" component={Logout}/> */}
      </div>
    );
  }
}

export default App;
