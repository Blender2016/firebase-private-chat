import React, {Component} from "react";
import Styles from "./ResetPassword.module.css";
import axios from "../../axios_base";
import 'font-awesome/css/font-awesome.min.css';
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import Spinner from "../../Components/Spinner/Spinner";

class ResetPassword extends Component{
    
    state={

        password:{
            value:"",
            isValid:true,
            IsToutched:false
        },

        confirmPassword:{
            value:"",
            isValid:true,
            IsToutched:false,
            confirmMessage:null
        },

        isValid:false
    };

    getResetKey=( name, url )=> {
        if (!url) url = window.location.href;
        // name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
        name = name.replace(/[[]/,"\\[").replace(/[\]]/,"\\]");
        var regexS = "[\\?&]"+name+"=([^&#]*)";
        var regex = new RegExp( regexS );
        var results = regex.exec( url );
        return results == null ? null : results[1];
    }

    resetPasswordClickedHandler=(e)=>{
        e.preventDefault();
        //create a form data and append all data into it 
        var fd = new FormData();
        fd.append('newPassword',this.state.password.value);
        fd.append('confirmNewPassword',this.state.confirmPassword.value);

        var resetKey = this.getResetKey('resetpasswordkey', window.location.href);
        axios.post(`/resetpassword/${resetKey}`,fd).then(res=>{
            console.log(res.data);
        }).catch(err=>{
            console.log(err);
            console.log('faild');
        });
        
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

    confirmPasswordChangeHandler=(e)=>{

        this.setState({
            confirmPassword:{
                value:e.target.value,
                isValid:true,
                IsToutched:true,
                confirmMessage:null
            }
        });

        if(this.state.password.value){
            if(this.state.password.value === e.target.value){
                this.setState({
                    confirmPassword:{
                        value:e.target.value,
                        isValid:true,
                        IsToutched:true,
                        confirmMessage:null
                    }
                });
            }else{
                this.setState({
                    confirmPassword:{
                        value:e.target.value,
                        isValid:false,
                        IsToutched:true,
                        confirmMessage:"The passwords does not match"
                    }
                });
            }
        }else{
            this.setState({
                confirmPassword:{
                    value:e.target.value,
                    isValid:false,
                    IsToutched:true,
                    confirmMessage:"Please enter password first"
                }
            });
        }
        this.formIsValid();
    }


    formIsValid =()=>{
        if(this.state.password.isValid && this.state.confirmPassword.isValid
        && this.state.password.IsToutched && this.state.confirmPassword.IsToutched ){
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
                            <h2>Reset your password</h2>
                        </div>
                        <div className={rowClearfix.join(' ')}>
                            <div className="">
                                
                                <form onSubmit={this.resetPasswordClickedHandler}>
                                    
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
                                    <div className={Styles.inputField}> 
                                        <span><i aria-hidden="true" className="fa fa-lock"></i></span>
                                        <input type="password" name="confimPassword"
                                         placeholder="Re-type Password" required 
                                            value={this.state.confirmPassword.value}
                                            onChange={this.confirmPasswordChangeHandler}
                                            onKeyDown={this.confirmPasswordChangeHandler}
                                            onKeyPress={this.confirmPasswordChangeHandler}
                                            onKeyUp={this.confirmPasswordChangeHandler}
                                         />
                                    </div>
                                    {!this.state.confirmPassword.isValid ? <h6> {this.state.confirmPassword.confirmMessage} </h6> : null}
                                   
                                    {this.state.isValid ? <input type="submit" value="Reset Password"/> : <input type="submit" value="Reset Password" disabled/>}
                                </form>
                            </div>
                        </div>
                    </div>
                    // {/* <p className={Styles.credit}>Password updated Successfully, plz <Link to="/login" className={Styles.Link}>Sign in</Link> to continue.</p> */}
            );
        }
        return(
            <div className={Styles.formWrapper}>
                    {formView}
            </div>
        );
    }
}

const mapStateToProps = (state)=>{
    return{
        loading : state.Auth.loading
    }
}

export default connect(mapStateToProps)(withRouter(ResetPassword));