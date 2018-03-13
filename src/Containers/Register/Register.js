import React, {Component} from "react";
import Styles from "./Register.module.css";
import 'font-awesome/css/font-awesome.min.css';
import backgroundImage from "../../assets/images/573587.png";
import validator from 'validator';
import {connect} from "react-redux";
import * as actionCreators from "../../Store/actions/index";
import {withRouter,Link} from "react-router-dom";
import Spinner from "../../Components/Spinner/Spinner";

class Register extends Component{
    
    state={
        imgData:null,

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

        confirmPassword:{
            value:"",
            isValid:true,
            IsToutched:false,
            confirmMessage:null
        },

        userName:{
            value:"",
            isValid:true,
            IsToutched:false
        },

        firstName:{
            value:"",
            isValid:true,
            IsToutched:false
        },

        lastName:{
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



    registerClickedHandler=(e)=>{
        e.preventDefault();
        //create a form data and append all data into it 
        var fd = new FormData();
        fd.append('imgData',this.state.imgData);
        fd.append('op','base64');
        fd.append('first',this.state.firstName.value);
        fd.append('last',this.state.lastName.value);
        fd.append('username',this.state.userName.value);
        fd.append('email',this.state.email.value);
        fd.append('password',this.state.password.value);
        fd.append('isOnline',true);
        this.props.onRegister(fd,this.props.history);
    }

    handleClick=(e)=>{
        e.preventDefault();
        this.inputElement.click();
    }

    fileClickedHandler=(e)=>{
        console.log(e.target.files[0]);
          var image = e.target.files[0];
          var reader  = new FileReader();
          
              reader.addEventListener("load", ()=> {
                this.setState({
                imgData:reader.result
                });
                console.log('image:' , this.state.imgData);
              }, false);
            
              if (image) {
                reader.readAsDataURL(image)
              }
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

    userNameChangeHandler=(e)=>{

        this.setState({
            userName:{
                value:e.target.value,
                isValid:true,
                IsToutched:true
            }
        });

        if(e.target.value.length > 0){
            this.setState({
                userName:{
                    value:e.target.value,
                    isValid:true,
                    IsToutched:true
                }
            });
        }else{
            this.setState({
                userName:{
                    value:e.target.value,
                    isValid:false,
                    IsToutched:true
                }
            });
        }
        this.formIsValid();
    }

    firstNameChangeHandler=(e)=>{

        this.setState({
            firstName:{
                value:e.target.value,
                isValid:true,
                IsToutched:true
            }
        });

        if(e.target.value.length > 0){
            this.setState({
                firstName:{
                    value:e.target.value,
                    isValid:true,
                    IsToutched:true
                }
            });
        }else{
            this.setState({
                firstName:{
                    value:e.target.value,
                    isValid:false,
                    IsToutched:true
                }
            });
        }
        this.formIsValid();
    }
    lastNamechangeHandler=(e)=>{

        this.setState({
            lastName:{
                value:e.target.value,
                isValid:true,
                IsToutched:true
            }
        });

        if(e.target.value.length > 0){
            this.setState({
                lastName:{
                    value:e.target.value,
                    isValid:true,
                    IsToutched:true
                }
            });
        }else{
            this.setState({
                lastName:{
                    value:e.target.value,
                    isValid:false,
                    IsToutched:true
                }
            });
        }
        this.formIsValid();
    }

    formIsValid =()=>{
        if(this.state.email.isValid && this.state.password.isValid && this.state.confirmPassword.isValid
        && this.state.userName.isValid && this.state.firstName.isValid && this.state.lastName.isValid
        && this.state.email.IsToutched && this.state.password.IsToutched && this.state.confirmPassword.IsToutched 
        && this.state.userName.IsToutched && this.state.firstName.IsToutched && this.state.lastName.IsToutched
        ){
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
        // console.log(this.state.isValid);
        var bcImage= this.state.imgData ? this.state.imgData : backgroundImage;
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
                            <h2>Registration Form</h2>
                        </div>
                        <div className={rowClearfix.join(' ')}>
                            <div className="">
                                <input className={Styles.Upload} type="file" 
                                    onChange={this.fileClickedHandler}
                                    ref={input => this.inputElement = input}
                                    required
                                />
                                {/* // eslint-disable-next-line */}
                                <a href="" className={Styles.profilePic} onClick={this.handleClick}>
                                    <div className={Styles.profilePic} 
                                         style={{backgroundImage: "url(" + bcImage + ")"}}
                                    >
                                        <span className="fa fa-camera"></span>
                                        <span>Change Image</span>
                                    </div>
                                </a>
                                <form onSubmit={this.registerClickedHandler}>
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
                                    <div className={Styles.inputField}> 
                                        <span><i aria-hidden="true" className="fa fa-user"></i></span>
                                        <input type="text" name="userName" placeholder="User Name" required
                                        value={this.state.userName.value} 
                                            onChange={this.userNameChangeHandler}
                                            onKeyDown={this.userNameChangeHandler}
                                            onKeyPress={this.userNameChangeHandler}
                                            onKeyUp={this.userNameChangeHandler}
                                        />
                                    </div>
                                    {!this.state.userName.isValid ? <h6> Please enter your userName </h6> : null}
                                    <div className={rowClearfix.join(' ')}>
                                        <div className={Styles.colHalf}>
                                            <div className={Styles.inputField}> 
                                                <span><i aria-hidden="true" className="fa fa-user"></i></span>
                                                <input type="text" name="fname" placeholder="First Name" required
                                                    value={this.state.firstName.value}
                                                    onChange={this.firstNameChangeHandler}
                                                    onKeyDown={this.firstNameChangeHandler}
                                                    onKeyPress={this.firstNameChangeHandler}
                                                    onKeyUp={this.firstNameChangeHandler}
                                                />
                                            </div>
                                            {!this.state.firstName.isValid ? <h6> Please enter your first name </h6> : null}
                                        </div>
                                        <div className={Styles.colHalf}>
                                            <div className={Styles.inputField}> 
                                                <span><i aria-hidden="true" className="fa fa-user"></i></span>
                                                <input type="text" name="lname" placeholder="Last Name" required
                                                    value={this.state.lastName.value}
                                                    onChange={this.lastNamechangeHandler}
                                                    onKeyDown={this.lastNamechangeHandler}
                                                    onKeyPress={this.lastNamechangeHandler}
                                                    onKeyUp={this.lastNamechangeHandler}
                                                />
                                            </div>
                                            {!this.state.lastName.isValid ? <h6> Please enter your last name </h6> : null}
                                        </div>
                                    </div>
                                    {this.state.isValid ? <input type="submit" value="Register"/> : <input type="submit" value="Register" disabled/>}
                                </form>
                            </div>
                        </div>
                        <p className={Styles.credit}>Already have an account?  <Link to="/login" className={Styles.Link}>Sign in</Link></p>
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
        onRegister:(userData,history) => dispatch(actionCreators.onRegister(userData,history))
    };
}


export default connect(mapStateToProps,mapDispatchToProps)(withRouter(Register));