import React, {Component} from "react";
import Styles from "./Profile.module.css";
import {message } from 'antd';
import 'font-awesome/css/font-awesome.min.css';
import backgroundImage from "../../assets/images/573587.png";
import {connect} from "react-redux";
import {withRouter, Link} from "react-router-dom";
import * as actionCreators from "../../Store/actions/index";
import Spinner from "../../Components/Spinner/Spinner";
import axios from "../../axios_base";

class Profile extends Component{
    
    state={
        imgData:null,

        userName:{
            value:"",
            isValid:true,
            IsToutched:false
        },
        oldPassword:{
            value:"",
            isValid:true,
            IsToutched:false,
            message:""
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
        visible:false,
        passwordUpdatedMessage:"",
        openPasswordUpdate:false,
        isValid:false
    };

    componentWillMount(){
        if(this.props.userName){
            this.setState({
                userName:{
                    value:this.props.userName,
                    isValid:true,
                    IsToutched:false,
                }
            });
        }

        if(!this.props.isAuth){
            this.props.history.push('/login');
        }
    }

    

    updateProfileClickedHandler=(e)=>{
        e.preventDefault();
        //create a form data and append all data into it 
        let name = this.state.userName.value;
        if(!name){
            name = this.props.userName;
        }

        console.log('userName',name);
        
        var fd = new FormData();
        fd.append('imgData',this.state.imgData);
        fd.append('userImage',this.props.userImage);
        fd.append('op','base64');
        fd.append('username',name);
        fd.append('email',this.props.email);
        this.props.onProfileUpdate(fd);
    };


    updatePasswordClickedHandler=(e)=>{
        e.preventDefault();
            let newPassword = this.state.password.value;
            axios.patch('/updatepassword',{
                email:this.props.email,
                password:newPassword
            }).then(res=>{
                console.log('password updated successfully');
                message.success('password updated successfully');
                this.setState({
                    passwordUpdatedMessage:"password updated successfully"
                });
            }).catch(err=>{
                console.log('updated failed');
                message.error('updated failed');
                this.setState({
                    passwordUpdatedMessage:"password updated failed"
                });
            });
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


    oldPasswordChangeHandler=(e)=>{

         this.setState({
            oldPassword:{
                value:e.target.value,
                isValid:true,
                IsToutched:true,
                message:""
            }
        });

        axios.post('/passwdconfirm',{
            email:this.props.email,
            password:this.state.oldPassword.value
        }).then((res)=>{
            console.log(res.data);
            this.setState({
                oldPassword:{
                    value:this.state.oldPassword.value,
                    isValid:true,
                    IsToutched:true,
                    message:""
                }
            });
        }).catch((err)=>{
            this.setState({
                oldPassword:{
                    value:this.state.oldPassword.value,
                    isValid:false,
                    IsToutched:true,
                    message:"Password in incorrect"
                }
            });
        });

        this.updatePasswordIsValid();
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
        this.updatePasswordIsValid();
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
        this.updatePasswordIsValid();
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
        // this.formIsValid();
    }




    // formIsValid =()=>{
    //     if( this.state.userName.isValid  && this.state.userName.IsToutched  ){
    //         this.setState({
    //             isValid:true
    //         });
    //     }else{
    //         this.setState({
    //             isValid:false
    //         });
    //     }
    // }

    updatePasswordIsValid=()=>{
        if( this.state.oldPassword.isValid  && this.state.oldPassword.IsToutched && 
            this.state.password.isValid && this.state.confirmPassword.isValid 
            && this.state.password.IsToutched && this.state.confirmPassword.IsToutched    
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

    openChangePasswordModal=(e)=>{
        e.preventDefault();
        this.setState({
            visible:true
        });
    }

    cancelChangePasswordModal=(e)=>{
        e.preventDefault();
        this.setState({
            visible:false
        });
    }


    

    render(){
        var userProfileImage = this.props.userImage ? this.props.userImage : backgroundImage;
        var bcImage= this.state.imgData ? this.state.imgData : userProfileImage;
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
                            <h2>User Profile</h2>
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
                                <form onSubmit={this.updateProfileClickedHandler}>
                                    <div className={Styles.inputField}> 
                                        <span><i aria-hidden="true" className="fa fa-user"></i></span>
                                        <input type="text" name="userName" placeholder="User Name"
                                            value={this.state.userName.value} 
                                            onChange={this.userNameChangeHandler}
                                            onKeyDown={this.userNameChangeHandler}
                                            onKeyPress={this.userNameChangeHandler}
                                            onKeyUp={this.userNameChangeHandler}
                                        />
                                    </div>
                                    {!this.state.userName.isValid ? <h6> Please enter your userName </h6> : null}
                                 
                                    {/* {this.state.isValid ? <input type="submit" value="Update"/> : <input type="submit" value="Update" disabled/>} */}
                                    <input type="submit" value="Update"/>
                                </form>
                            </div>
                        </div>
                        <p className={Styles.credit}>   <a href="" onClick={this.openChangePasswordModal} 
                        className={Styles.Link}> Change Password </a></p>
                        <p className={Styles.credit}>   <Link to="/chat"  
                                className={Styles.Link}> Goto chat </Link></p>
                       
                        
                    </div>
            );
        }

        var passwrodFormView;
        if(this.props.loading){
            passwrodFormView=(
                <Spinner/>
            );
        }else{
            passwrodFormView=(
                <div className={Styles.formContainer}>
                        <div className={Styles.titleContainer}>
                            <h2>Update Your Password</h2>
                        </div>
                        <div className={rowClearfix.join(' ')}>
                            <div className="">
                                
                                <form onSubmit={this.updatePasswordClickedHandler}>

                                    <div className={Styles.inputField}> 
                                        <span><i aria-hidden="true" className="fa fa-lock"></i></span>
                                        <input type="password" name="oldPassword" placeholder="old Password" required
                                            value={this.state.oldPassword.value} 
                                            onChange={this.oldPasswordChangeHandler}
                                            onMouseLeave={this.oldPasswordChangeHandler}
                                            onMouseOut={this.oldPasswordChangeHandler}
                                            onKeyDown={this.oldPasswordChangeHandler}
                                            onKeyPress={this.oldPasswordChangeHandler}
                                            onKeyUp={this.oldPasswordChangeHandler}
                                        />
                                    </div>
                                    {!this.state.oldPassword.isValid ? <h6> {this.state.oldPassword.message} </h6> : null}

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
                                 
                                    {this.state.isValid ? <input type="submit" value="Update"/> : <input type="submit" value="Update" disabled/>}
                                </form>
                            </div>
                            <p className={Styles.credit}> {this.state.passwordUpdatedMessage} </p>
                            <p className={Styles.credit}>   <a href=""  
                                onClick={this.cancelChangePasswordModal}
                                className={Styles.Link}> Close </a></p>
                        </div>
                        
                        
                    </div>
            );
        }


        return(
            <div className={Styles.formWrapper}>
                    {!this.state.visible ? formView : passwrodFormView}
            </div>
        );
    }
}

const mapStateToProps =state=>{
    return{
        ownerId:state.Auth.ownerId,
        token:state.Auth.token,
        email:state.Auth.email,
        userName:state.Auth.ownerName,
        userImage:state.Auth.userImage,
        loading:state.Auth.loading,
        isAuth:state.Auth.isAuth
    }
}

const mapDispatchToProps = dispatch =>{
    return{
        onProfileUpdate:(userData) => dispatch(actionCreators.onProfileUpdate(userData))
    };
}

export default connect(mapStateToProps,mapDispatchToProps)(withRouter(Profile));