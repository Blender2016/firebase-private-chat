import React, {Component} from "react";
import Styles from "./Chat.module.css";
import Left from "../Left/Left";
import Right from "../Right/Right";
// import MessageList from "../../components/MessageList/MessageList";
import {connect} from "react-redux";
import firebaseApp from "../../js/firebase";
// import uuidv4 from "uuid/v4";
import {withRouter} from "react-router-dom";
import _ from "lodash";
import messageModel from "../../js/models/message";
// import userModel from "../../js/models/user";
import notificationModel from "../../js/models/notification";


var database= firebaseApp.database();

class Chat extends Component{
    state={
        messages:[],
        chatId:null,
        notificationId:null,
        otherId:null,
        otherName:null,
        otherUserImage:null,
        notifications:[],
        users:[]
    };

    componentWillMount(){
        if(!this.props.isAuth){
            this.props.history.push('/login');
        }

        //  listen to all changes in notifications model
        database.ref('/notifications').on('value',(snapshot)=>{
            if(snapshot.val() !== null){
                this.getAllNotifications(snapshot.val());
            }
        });

        //get all users
        database.ref('/users').on('value',(snapshot)=>{
            if(snapshot.val() !== null){
                this.getAllUsers(snapshot.val());
            }
        });
    }

    getAllNotifications=(values)=>{
        let notificationsVal = values;
        console.log('before mapping',notificationsVal);
        let notificationsArr = Object.keys(notificationsVal).map(key => notificationsVal[key]);
        console.log('notifications wwwww=>',notificationsArr);
        this.setState({
            notifications:notificationsArr
        });
        console.log('notifications => ',notificationsArr);
    }

    removeAllNotification=(e)=>{
        e.preventDefault();
        let myNotifications = _.filter(this.state.notifications,notification => notification.otherId === this.props.ownerId);
        let notificationIdList = myNotifications.map(notification=> notification.id); 
        console.log('notificationIdList',notificationIdList);
        notificationIdList.forEach(element => {
            console.log(element);
            // database.ref(' /notifications/ ' + element).remove();
            database.ref('/notifications').child(element).remove().then(()=> {
                // Code after remove
                console.log(element,'removed');

                //  listen to all changes in notifications model
                database.ref('/notifications').on("value",(snapshot)=>{
                    if(snapshot.val() !== null){
                        this.getAllNotifications(snapshot.val());
                    }
                });
                this.setState({
                    notifications:[]
                });
            });
        });

        // alert('remooved');
        
    }

    getAllData(values){
        let messagesVal = values;
        let messages = _(messagesVal)
                          .keys()
                          .map(messageKey => {
                              let cloned = _.clone(messagesVal[messageKey]);
                              cloned.key = messageKey;
                              return cloned;
                          })
                          .value();
          this.setState({
            messages: messages
          });
      }


    getAllUsers(values){
        let usersVal = values;
        let users = _(usersVal)
        .keys()
        .map(userKey => {
            let clonedUser = _.clone(usersVal[userKey]);
            return clonedUser; 
        }).value();
        console.log('users:=>',users);
        this.setState({
            users:users
        });
  
    }

      getAllUsersThatOwnerChatWithThem = (otherUserId) =>{
        let ownerUsersIdList = null;
        database.ref('/users/' + this.props.ownerId).on('value',(snapshot)=>{
            if(snapshot.val() !== null && snapshot.val().hasOwnProperty('chatWith')){
                // ownerUsersIdList = snapshot.val().chatWith.find( item => item.otherId === otherUserId ).otherId;
                ownerUsersIdList = snapshot.val().chatWith.map( item => item.otherId );
            }
        });
        console.log('otherIds',ownerUsersIdList);
        // alert(ownerUsersIdList);
        return ownerUsersIdList;
    }

    userReadAllMessages=(userId,chatId)=>{
        let chatWith; 
        database.ref(`/users/${userId}/chatWith/`).on('value',(snapshot)=>{
            chatWith = snapshot.val();
        });
        // let itemIndex = chatWith.findIndex(item => item.chatId === this.props.chatId);

        chatWith.find(item => item.otherId === this.props.ownerId).unread = 0;
        // console.log('chatWith:',chatWith[itemIndex]);
        // if(itemIndex !== -1){
        //     chatWith[itemIndex].unread = 0;
        // }
        database.ref('/users/' + userId).update({
            chatWith:chatWith
        });
    }

    userClickedHandler =(user)=>{
        // clean message list
        this.setState({
            messages:[],
            otherId:user.id,
            otherName:user.name,
            otherUserImage:user.imageUrl,
        });
    
        if(this.getAllUsersThatOwnerChatWithThem(user.id) !== null){
            // check if user.id is in list .
            if(this.getAllUsersThatOwnerChatWithThem(user.id).includes(user.id)){
                // then owner chat with this user before 
                
                //get the chat id between them
                let chatIdBetweenUs = null;
                database.ref('/users/' + this.props.ownerId).on('value',(snapshot)=>{
                    if(snapshot.val() !== null && snapshot.val().hasOwnProperty('chatWith')){
                        chatIdBetweenUs = snapshot.val().chatWith.find( item => item.otherId === user.id ).chatId;
                    }
                });
    
                // user read all messages
                this.userReadAllMessages(user.id,chatIdBetweenUs);
    
                // get all messages in the chat
                let app = database.ref(`${chatIdBetweenUs}`);
                app.on('value', snapshot => {
                    if(snapshot.val() !== null){
                        this.getAllData(snapshot.val());
                    }
                
                });
    
                this.setState({
                        chatId:chatIdBetweenUs
                    });
    
                
            }else{
                // then owner doesn't chat with this user before
                // create chat id 
                let chatId = database.ref('/').push().key;
                // create notification id 
                let notificationId = database.ref('/notifications/').push().key;
    
                // update owner chatWith list by adding otherId
                //get all chatWith users
        let chatWith; 
        database.ref(`/users/${this.props.ownerId}/chatWith/`).on('value',(snapshot)=>{
            chatWith = snapshot.val();
        });
    
            
        //update owner user by adding users he talking with them
        let nowChatWith={
            otherId:user.id,
            chatId:chatId,
            unread:1
        };
    
        if(chatWith!==null){
            chatWith.push(nowChatWith);
        }else{
            chatWith=[nowChatWith];
        }
        
    
        database.ref('/users/'+this.props.ownerId).update({
            chatWith:chatWith
        });
                
                // update other chatWith list by adding ownerId
               
                let otherChatWith; 
                database.ref(`/users/${user.id}/chatWith/`).on('value',(snapshot)=>{
                    otherChatWith = snapshot.val();
                });
                    
                //update other user by adding users he talking with them
                let userNeedToChat={
                    otherId:this.props.ownerId,
                    chatId:chatId,
                    unread:0
                };
            
                if(otherChatWith!==null){
                    otherChatWith.push(userNeedToChat);
                }else{
                    otherChatWith=[userNeedToChat];
                }
            
                database.ref('/users/'+ user.id).update({
                    chatWith:otherChatWith
                });
    
                // send welcome message to otherUser
                let message = messageModel(this.props.ownerId,`Hello, ${user.name}`);
                database.ref(`/${chatId}`).push(message).then(()=>{
                    console.log('message sent');
                }).catch((err)=>{
                    console.log('message failed',err);
                });
    
                // send notification to other user
                let notification = notificationModel(notificationId,this.props.ownerId,user.id,chatId);
                database.ref('/notifications/'+notificationId).set(notification).then(()=>{
                    console.log('success');
                }).catch((err)=>{
                    console.log('conversation error :',err);
                });


                //  listen to all changes in notifications model
                database.ref('/notifications').on('value',(snapshot)=>{
                    if(snapshot.val() !== null){
                        this.getAllNotifications(snapshot.val());
                    }
                });
    
                // get all messages between owner and other in chat id
                let app = database.ref(`${chatId}`);
                app.on('value', snapshot => {
                    if(snapshot.val() !== null){
                        this.getAllData(snapshot.val());
                    }
                });
    
                this.setState({
                        chatId:chatId,
                        notificationId:notificationId
                    });
            }
        }else{
            // alert('nooooooo');
            // then owner doesn't chat with this user before
                // create chat id 
                let chatId = database.ref('/').push().key;
                // create notification id 
                let notificationId = database.ref('/notifications/').push().key;
                
    
    
                //get all chatWith users
        let chatWith; 
        database.ref(`/users/${this.props.ownerId}/chatWith/`).on('value',(snapshot)=>{
            chatWith = snapshot.val();
        });
    
            
        //update owner user by adding users he talking with them
        let nowChatWith={
            otherId:user.id,
            chatId:chatId,
            unread:1
        };
    
        if(chatWith!==null){
            chatWith.push(nowChatWith);
        }else{
            chatWith=[nowChatWith];
        }
        
    
        database.ref('/users/'+this.props.ownerId).update({
            chatWith:chatWith
        });
                
                
    
                let otherChatWith; 
                database.ref(`/users/${user.id}/chatWith/`).on('value',(snapshot)=>{
                    otherChatWith = snapshot.val();
                });
                    
                //update other user by adding users he talking with them
                let userNeedToChat={
                    otherId:this.props.ownerId,
                    chatId:chatId,
                    unread:0
                };
            
                if(otherChatWith!==null){
                    otherChatWith.push(userNeedToChat);
                }else{
                    otherChatWith=[userNeedToChat];
                }
            
                database.ref('/users/'+ user.id).update({
                    chatWith:otherChatWith
                });
    
                // send welcome message to otherUser
                let message = messageModel(this.props.ownerId,`Hello, ${user.name}`);
                database.ref(`/${chatId}`).push(message).then(()=>{
                    console.log('message sent');
                }).catch((err)=>{
                    console.log('message failed',err);
                });
    
                // send notification to other user
                let notification = notificationModel(notificationId,this.props.ownerId,user.id,chatId);
                database.ref('/notifications/'+notificationId).set(notification).then(()=>{
                    console.log('success');
                }).catch((err)=>{
                    console.log('conversation error :',err);
                });

                //  listen to all changes in notifications model
                database.ref('/notifications').on('value',(snapshot)=>{
                    if(snapshot.val() !== null){
                        this.getAllNotifications(snapshot.val());
                    }
                });
    
                // get all messages between owner and other in chat id
                let app = database.ref(`${chatId}`);
                app.on('value', snapshot => {
                    if(snapshot.val() !== null){
                        this.getAllData(snapshot.val());
                    }
                });
    
                this.setState({
                        chatId:chatId,
                        notificationId:notificationId
                    });
        }
    }


    offlineUser = () => {
        //check if user exists
        let ownerId = this.props.ownerId;
        database.ref('/users').child(ownerId).once('value', (snapshot)=> {    
            if(snapshot.val() !==null){
                    //update is online from firebase
                    database.ref('/users/' + ownerId).update({
                        isOnline:false,
                        loggedOutAt:Date.now()
                        });

                        //list all users after changes
                        //child_changed
                        database.ref('/users').on("value",(snapshot)=>{
                            if(snapshot.val() !== null){
                                this.getAllUsers(snapshot.val());
                            }
                        });
            }
        });
    }

    sendMessageClickedHandler = ()=>{
        let app = database.ref(`${this.state.chatId}`);
            app.on('value', snapshot => {
                if(snapshot.val() !== null){
                    this.getAllData(snapshot.val());
                }
            });
    };

    onlineUser = () => {
          //check if user exists
          let ownerId = this.props.ownerId;
          if(ownerId){
            database.ref('/users').child(ownerId).once('value', (snapshot)=> {    
                if(snapshot.val() !==null){
                        console.log('snapshot.val',snapshot.val());
                        //update is online from firebase
                        database.ref('/users/' + ownerId).update({
                            isOnline:true,
                            loggedOutAt:null
                            });

                            //list all users after changes
                            //child_changed
                            database.ref('/users').on("value",(snapshot)=>{
                                if(snapshot.val() !== null){
                                    this.getAllUsers(snapshot.val());
                                }
                            });
                }else{
                    console.log('user not found');
                }
            }); 
          }
    }
    
    


    render(){

        window.onbeforeunload = (e)=> {
            // var dialogText = 'Dialog text here';
            // e.returnValue = dialogText;
            this.offlineUser();
            // return dialogText;
        }
    
        window.onload=()=>{
            console.log('looooooodedd');
            this.onlineUser();
        }

        return(
            <div className={Styles.Wrapper}>
                <div className={Styles.Container}>
                    <Left userClicked={(user)=>this.userClickedHandler(user)} otherId={this.state.otherId}/>
                    <Right messages={this.state.messages} 
                        chatId={this.state.chatId} 
                        otherId={this.state.otherId}
                        otherName={this.state.otherName}
                        otherUserImage={this.state.otherUserImage}
                        notifications={this.state.notifications}
                        removeAllNotification={(e)=>this.removeAllNotification(e)}
                        users={this.state.users}
                        />
                </div>
            </div>
        );
    }
}

const mapStateToProps = state =>{
    return{
        ownerId:state.Auth.ownerId,
        userImage:state.Auth.userImage,
        ownerName:state.Auth.ownerName,
        email:state.Auth.email,
        token:state.Auth.token,
        isOnline:state.Auth.isOnline,
        loggedOutAt:state.Auth.loggedOutAt,
        isAuth:state.Auth.isAuth
    };
};

export default connect(mapStateToProps)(withRouter(Chat));