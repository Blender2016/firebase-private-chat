import React, {Component} from "react";
import Styles from "./ForgetPassword.module.css";
import 'font-awesome/css/font-awesome.min.css';
import validator from 'validator';
import {connect} from "react-redux";
import axios from "../../axios_base";
import Spinner from "../../Components/Spinner/Spinner";



class ForgetPassword extends Component{
    
    state={

        email:{
            value:"",
            isValid:true,
            IsToutched:false,
        },
        arrived:false,
        message:null,
        isValid:false
    };

    snedMailClickedHandler=(e)=>{
        e.preventDefault();
        var fd = new FormData();
        fd.append('email',this.state.email.value);
        axios.post('/forgetpassword',fd).then(res=>{
                console.log(res.data);
                this.setState({
                    arrived:true,
                    message:'Please check your email to update your password'
                });
            }).catch(err=>{
                console.log('error',err);
                this.setState({
                    arrived:false,
                    message:'Something is wrong, please send your email again'
                });
            });
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



  

    formIsValid =()=>{
        if(this.state.email.isValid && this.state.email.IsToutched )
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
        console.log('this.props.loading',this.props.loading);
        if(this.props.loading){
            formView=(
                <Spinner/>
            );
        }else{
            formView=(
                <div className={Styles.formContainer}>
                <div className={Styles.titleContainer}>
                    <h2>Enter your e-mail</h2>
                </div>
                <div className={rowClearfix.join(' ')}>
                    <div className="">
                        <form onSubmit={this.snedMailClickedHandler}>
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

                            {this.state.isValid ? <input type="submit" value="Send"/> : <input type="submit" value="Send" disabled/>}
                        </form>
                    </div>
                </div>
                {this.state.arrived ? <p className={Styles.credit}> {this.state.message} </p> 
                : <p className={Styles.credit}> {this.state.message} </p>}
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
    console.log('state',state);
    return{
        loading : state.Auth.loading
    }
}

export default connect(mapStateToProps)(ForgetPassword);