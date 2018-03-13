import React, {Component} from "react";
import Styles from "./Login.module.css";
import 'font-awesome/css/font-awesome.min.css';
import validator from 'validator';
import {connect} from "react-redux";
import * as actionCreators from "../../Store/actions/index";
import {withRouter,Link} from "react-router-dom";
import Spinner from "../../Components/Spinner/Spinner";

class Login extends Component{
    
    state={

        email:{
            value:"",
            isValid:true,
            IsToutched:false,
        },

        password:{
            value:"",
            isValid:true,
            IsToutched:false
        },
        isValid:false
    };

    componentWillMount(){
        if(this.props.isAuth){
                this.props.history.push('/chat');
        }
    }

   

    LoginClickedHandler=(e)=>{
        e.preventDefault();
        //create a form data and append all data into it 
        var fd = new FormData();
        fd.append('email',this.state.email.value);
        fd.append('password',this.state.password.value);
        fd.append('isOnline',true);
        this.props.onLogin(fd,this.props.history);
    }

    emailChangeHandler=(e)=>{
         this.setState({
            email:{
                value:e.target.value,
                isValid:true,
                IsToutched:true
            }
        });

        if(validator.isEmail(e.target.value)){
            this.setState({
                email:{
                    value:e.target.value,
                    isValid:true,
                    IsToutched:true
                }
            });
        }else{
            this.setState({
                email:{
                    isValid:false,
                    value:e.target.value,
                    IsToutched:true
                }
            });
        }

        this.formIsValid();
    }

    passwordChangeHandler=(e)=>{

        this.setState({
            password:{
                value:e.target.value,
                isValid:true,
                IsToutched:true
            }
        });

        if(e.target.value.length >=5 ){
            this.setState({
                password:{
                    value:e.target.value,
                    isValid:true,
                    IsToutched:true
                }
            });
        }else{
            this.setState({
                password:{
                    value:e.target.value,
                    isValid:false,
                    IsToutched:true
                }
            });
        }
        this.formIsValid();
    }

  

    formIsValid =()=>{
        if(this.state.email.isValid && this.state.password.isValid &&
             this.state.email.IsToutched && this.state.password.IsToutched )
             {
                this.setState({
                    isValid:true
                });
        }else{
            this.setState({
                isValid:false
            });
        }
    }


    

    render(){
        var rowClearfix= [Styles.Clearfix,Styles.row];

        var formView;
        if(this.props.loading){
            formView=(
                <Spinner/>
            );
        }else{
            formView=(
                <div className={Styles.formContainer}>
                        <div className={Styles.titleContainer}>
                            <h2>Login Form</h2>
                        </div>
                        <div className={rowClearfix.join(' ')}>
                            <div className="">
                                <form onSubmit={this.LoginClickedHandler}>
                                    <div className={Styles.inputField}>
                                        <span><i aria-hidden="true" className="fa fa-envelope"></i></span>
                                        <input type="email" name="email" placeholder="Email" required
                                        value={this.state.email.value}
                                        onChange={this.emailChangeHandler} 
                                        onKeyDown={this.emailChangeHandler}
                                        onKeyPress={this.emailChangeHandler}
                                        onKeyUp={this.emailChangeHandler}
                                        />
                                    </div>
                                    {!this.state.email.isValid ? <h6> Email is not a valid email </h6> : null}

                                    <div className={Styles.inputField}> 
                                        <span><i aria-hidden="true" className="fa fa-lock"></i></span>
                                        <input type="password" name="password" placeholder="Password" required
                                            value={this.state.password.value} 
                                            onChange={this.passwordChangeHandler}
                                            onKeyDown={this.passwordChangeHandler}
                                            onKeyPress={this.passwordChangeHandler}
                                            onKeyUp={this.passwordChangeHandler}
                                        />
                                    </div>
                                    {!this.state.password.isValid ? <h6> Password must be more than or equal to 5 characters </h6> : null}

                                    {this.state.isValid ? <input type="submit" value="Login"/> : <input type="submit" value="Login" disabled/>}
                                </form>
                            </div>
                        </div>
                        <p className={Styles.credit}>Didn't have an account?  <Link to="/" className={Styles.Link}> Register </Link></p>
                          <p className={Styles.Forget}><Link to="/forgetpassword" className={Styles.Forgetlink}> Forget Password </Link></p>
                    </div>
            );
        }
        return(
            <div className={Styles.formWrapper}>
                    {formView}
            </div>
        );
    }
}

const mapStateToProps = state =>{
    console.log(state);
    return{
        loading:state.Auth.loading,
        isAuth:state.Auth.isAuth,
    }
};
const mapDispatchToProps = dispatch =>{
    return{
        onLogin:(userData,history) => dispatch(actionCreators.onLogin(userData,history))
    };
}


export default connect(mapStateToProps,mapDispatchToProps)(withRouter(Login));