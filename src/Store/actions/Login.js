import * as actionTyps from "./actionTypes";
import axios from "../../axios_base";
// import userModel from "../../js/models/user";
import firebaseApp from "../../js/firebase";

const onLoginStart=()=>{
    return{
        type:actionTyps.ON_LOGIN_START
    };
};
const onLoginSuccess=(id,imageUrl,userName,email,token,isOnline,loggedOutAt)=>{
    return{
        type:actionTyps.ON_LOGIN_SUCCESS,
        userId:id,
        imageUrl:imageUrl,
        userName:userName,
        userMail:email,
        authToken:token,
        isOnline:isOnline,
        loggedOutAt:loggedOutAt
    };
};
const onLoginFail=()=>{
    return{
        type:actionTyps.ON_LOGIN_FAIL
    };
};





export const onLogin=(userCredentials)=>{
    return dispatch=>{
        console.log('loading....');
        dispatch(onLoginStart());
        axios.post('/login',userCredentials).then(res=>{
            console.log(res.data);
            console.log('status :',res.status); 
            // var token = res.headers['x-auth']; ///fetch x-auth from the header .
            var id = res.data._id;
            var imageUrl=res.data.userImage.url;
            var email = res.data.email;
            var userName = res.data.username;
            var isOnline=true;
            var loggedOutAt=res.data.loggedOutAt;
            var token = res.data.tokens[0].token;
            let database = firebaseApp.database();
           

            // update user data in firebase
            database.ref('/users/'+id).update({
                token:token,
                isOnline:true,
                loggedOutAt:null
            });

            dispatch(onLoginSuccess(id,imageUrl,userName,email,token,isOnline,loggedOutAt));
        }).catch(err=>{
            dispatch(onLoginFail());
        });
    };

};