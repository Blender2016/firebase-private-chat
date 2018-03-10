import React, {Component} from "react";
import Styles from "./Write.module.css";
import firebaseApp from "../../js/firebase";
import messageModel from "../../js/models/message";
import {connect} from "react-redux";

var database= firebaseApp.database();

class Write extends Component{
    state={
        message:''
    };

    sendClickedHandler=(e)=>{
        this.onKeyUpClicked();
        e.preventDefault();
        // let messageId = this.props.db.ref(`/${this.props.chatId}/`).push().key;
        let message = messageModel(this.props.ownerId,this.state.message);
        database.ref(`/${this.props.chatId}`).push(message).then(()=>{
            console.log('message sent');
        }).catch((err)=>{
            console.log('message failed',err);
        });

            this.newMessageAdded();

        this.setState({
            message:''
        });
    };

    newMessageAdded=()=>{

        let chatWith; 
        database.ref(`/users/${this.props.ownerId}/chatWith/`).on('value',(snapshot)=>{
            chatWith = snapshot.val();
        });
        if(chatWith !== null){
            // let itemIndex = chatWith.findIndex(item => item.chatId === this.props.chatId);
            console.log('chatId********************************]>>>>>>>>',this.props.chatId);
            console.log('//***********************>>>{}>>>>', chatWith.find(item => item.chatId === this.props.chatId));
            chatWith.find(item => item.chatId === this.props.chatId).unread++;
            console.log('chatWith:---------------------->>>>>',chatWith);
            // chatWith[itemIndex].unread++
        }

        firebaseApp.database().ref('/users/'+this.props.ownerId).update({
            chatWith:chatWith
        });
    }

    onKeyDownClicked=()=>{
         //update isTyping from firebase
         console.log('key down');
         firebaseApp.database().ref('/users/'+this.props.ownerId).update({
            isTyping:true
        });
    }
    onKeyUpClicked=()=>{
        //update isTyping from firebase
        console.log('key up');
        firebaseApp.database().ref('/users/'+this.props.ownerId).update({
           isTyping:false
       });
   }


userReadAllMessages=()=>{
    if(this.props.otherId){
        let chatWith; 
        firebaseApp.database().ref(`/users/${this.props.otherId}/chatWith/`).on('value',(snapshot)=>{
            chatWith = snapshot.val();
        });
        // let itemIndex = chatWith.findIndex(item => item.chatId === this.props.chatId);

        chatWith.find(item => item.otherId === this.props.ownerId).unread = 0;
        // console.log('chatWith:',chatWith[itemIndex]);
        // if(itemIndex !== -1){
        //     chatWith[itemIndex].unread = 0;
        // }
        firebaseApp.database().ref('/users/' + this.props.otherId).update({
            chatWith:chatWith
        }); 
    }
}

    inputChangeHandler=(e)=>{
        this.onKeyDownClicked();
        let message = e.target.value;
        if (message.trim() !== ''){
            this.setState({
                message:message,
            });
        }
        this.userReadAllMessages();
    };

    render(){
        var writeLinkAttach = [Styles.WriteLink, Styles.Attach];
        var writeLinkSmiley = [Styles.WriteLink,Styles.Smiley];
        var writeLinkSend = [Styles.WriteLink,Styles.Send];
        return(
            <div className={Styles.Write}>
                {/* eslint-disable-next-line */}
                <a href="javascript:;" className={writeLinkAttach.join(' ')}></a>
                <input type="text" 
                    value={this.state.message}
                    onChange={this.inputChangeHandler}
                />
                {/* eslint-disable-next-line */}
                <a href="javascript:;" className={writeLinkSmiley.join(' ')}></a>
                {/* eslint-disable-next-line */}
                <a href="javascript:;" onClick={this.sendClickedHandler} className={writeLinkSend.join(' ')}></a>
            </div>
        );
    }
}

const mapStateToProps = state =>{
    return{
        ownerId:state.Auth.ownerId
    }
}

export default connect(mapStateToProps)(Write);