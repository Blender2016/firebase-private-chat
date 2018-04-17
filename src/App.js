import React, { Component } from 'react';
import Register from "./Containers/Register/Register";
import Login from "./Containers/Login/Login";
import {Route} from "react-router-dom";
import ForgetPassword from "./Containers/ForgetPassword/ForgetPassword";
import ResetPassword from "./Containers/ResetPassword/ResetPassword";
import Chat from "./Containers/Chat/Chat";
import Profile from "./Containers/Profile/Profile";
import Logout from "./Containers/Logout";
import Admin from "./Containers/Admin/Admin";

class App extends Component {
  render() {
    return (
      <div>
        <Route exact path='/' component={Register}/>
        <Route  path='/login' component={Login}/>
        <Route path="/forgetpassword" component={ForgetPassword}/>
        <Route path="/resetpassword" component={ResetPassword}/>
        <Route  path='/chat' component={Chat}/>
       <Route path="/profile" component={Profile}/>
       <Route path="/logout" component={Logout}/>
       <Route path='/admin' component={Admin}/>
        {/* <Route  path='/chat' component={Chat}/>
        <Route path='/register' component={Register}/>
        // <Route path="/resetpassword" component={ResetPassword}/>
        <Route path="/logout" component={Logout}/> */}
      </div>
    );
  }
}

export default App;
