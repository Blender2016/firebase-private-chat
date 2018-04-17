import * as actionTypes from "../actions/actionTypes";
import {updateObject} from "../utility";


const initialState={
    ownerId:null,
    userImage:null,
    ownerName:null,
    token:null,
    email:null,
    isOnline:false,
    isAdmin:false,
    loggedOutAt:null,
    isAuth:false,
    loading:false
};

const onRegisterStart =(state,action)=>{
    return updateObject(state,{
        loading:true
    });
};



const onRegisterSuccess =(state,action)=>{
    return updateObject(state,{
        ownerId:action.userId,
        userImage:action.imageUrl,
        ownerName:action.userName,
        email:action.userMail,
        token:action.authToken,
        isOnline:action.isOnline,
        isAdmin:action.isAdmin,
        loggedOutAt:action.loggedOutAt,
        isAuth:true,
        loading:false,
    });
};

const onRegisterFail =(state,action)=>{
    return updateObject(state,{
        isAuth:false,
        loading:false
    });
};

// const isRegistered = (state,action) =>{
//     return updateObject(state,{
//         loading:false
//     });
// }


const onLoginStart =(state,action)=>{
    return updateObject(state,{
        loading:true
    });
};

const onLoginSuccess =(state,action)=>{
    return updateObject(state,{
        ownerId:action.userId,
        userImage:action.imageUrl,
        ownerName:action.userName,
        email:action.userMail,
        token:action.authToken,
        isOnline:action.isOnline,
        isAdmin:action.isAdmin,
        loggedOutAt:action.loggedOutAt,
        isAuth:true,
        loading:false,
    });
};

const onLoginFail =(state,action)=>{
    return updateObject(state,{
        isAuth:false,
        loading:false
    });
};


const onLogoutStart=(state,action)=>{
    return updateObject(state,{
        loading:true
    });
};

const onLogoutSuccess=(state,action)=>{
    return updateObject(state,{
        loading:false,
        isAuth:false
        });
};

const onLogoutFail=(state,action)=>{
    return updateObject(state,{
        loading:false
    });
};

const onUpdateStart =(state,action)=>{
    return updateObject(state,{
        loading:true
    });
};

const onUpdateFail =(state,action)=>{
    return updateObject(state,{
        loading:false
    });
};

const onUpdateSuccess =(state,action)=>{
    return updateObject(state,{
        loading:false,
        ownerName:action.userName,
        userImage:action.userImage
    });
};

const isRegistered=(state,action)=>{
    return updateObject(state,{
        isAuth:true,
        loading:false
        });
};






const reducer = (state=initialState,action)=>{
    switch(action.type){
        //register reducers
        case actionTypes.ON_REGISTER_START: return onRegisterStart(state,action);
        case actionTypes.ON_REGISTER_SUCCESS: return onRegisterSuccess(state,action);
        case actionTypes.ON_REGISTER_FAIL: return onRegisterFail(state,action);
        // case actionTypes.IS_REGISTERED: return isRegistered(state,action);
         //login reducers
         case actionTypes.ON_LOGIN_START: return onLoginStart(state,action);
         case actionTypes.ON_LOGIN_SUCCESS: return onLoginSuccess(state,action);
         case actionTypes.ON_LOGIN_FAIL: return onLoginFail(state,action);
         //Logout reducer
         case actionTypes.ON_LOGOUT_START: return onLogoutStart(state,action);
         case actionTypes.ON_LOGOUT_SUCCESS: return onLogoutSuccess(state,action);
         case actionTypes.ON_LOGOUT_FAIL: return onLogoutFail(state,action);
         // user is registered
         case actionTypes.IS_REGISTERED: return isRegistered(state,action);
         //updateProfile
         case actionTypes.ON_UPDATE_START: return onUpdateStart(state,action);
         case actionTypes.ON_UPDATE_SUCCESS: return onUpdateSuccess(state,action);
         case actionTypes.ON_UPDATE_FAIL: return onUpdateFail(state,action);
        
        default: return state;
    }
};

export default reducer;