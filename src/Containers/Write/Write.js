import React, {Component} from "react";
import Styles from "./Write.module.css";
import firebaseApp from "../../js/firebase";
import messageModel from "../../js/models/message";
import {connect} from "react-redux";
// import EmojiPicker from 'emoji-picker-react';
import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart'
// import {emojify} from 'react-emojione';

// import { message } from 'antd';

var database= firebaseApp.database();

class Write extends Component{
    state={
        message:'',
        showEmojiPicker:false
    };

    sendClickedHandler=(e)=>{

        e.preventDefault();

        if(this.props.otherId){
            if(this.state.message){
                this.onKeyUpClicked();
                // let messageId = this.props.db.ref(`/${this.props.chatId}/`).push().key;
                let message = messageModel(this.props.ownerId,this.state.message);
                database.ref(`/${this.props.chatId}`).push(message).then(()=>{
                    console.log('message sent');
                }).catch((err)=>{
                    console.log('message failed',err);
                });

                    this.newMessageAdded();

                this.setState({
                    message:'',
                    showEmojiPicker:false
                });

                this.props.scrollToBottom();
            }else{
                alert('please , write a message to send ');
            }
        }else{
            alert('please, you must select a user to chat with');
        }

    };

    enterPressedHandler=(e)=>{
      if(this.props.otherId){
        if (e.key == 'Enter') {
            if(this.state.message){
                this.onKeyUpClicked();
                // let messageId = this.props.db.ref(`/${this.props.chatId}/`).push().key;
                let message = messageModel(this.props.ownerId,this.state.message);
                database.ref(`/${this.props.chatId}`).push(message).then(()=>{
                    console.log('message sent');
                }).catch((err)=>{
                    console.log('message failed',err);
                });

                    this.newMessageAdded();

                this.setState({
                    message:'',
                    showEmojiPicker:false
                });

                this.props.scrollToBottom();
            }else{
                alert('please , write a message to send ');
            }
        }
      }else{
        alert('please, you must select a user to chat with');
      }
    }

    newMessageAdded=()=>{

        let chatWith;
        database.ref(`/users/${this.props.ownerId}/chatWith/`).on('value',(snapshot)=>{
            chatWith = snapshot.val();
        });
        if(chatWith !== null){
            // let itemIndex = chatWith.findIndex(item => item.chatId === this.props.chatId);
            // console.log('chatId********************************]>>>>>>>>',this.props.chatId);
            // console.log('//***********************>>>{}>>>>', chatWith.find(item => item.chatId === this.props.chatId));
            chatWith.find(item => item.chatId === this.props.chatId).unread++;
            // console.log('chatWith:---------------------->>>>>',chatWith);
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
                showEmojiPicker:false
            });
        }
        this.userReadAllMessages();
    };

    showEmojiPicker=(e)=>{
        e.preventDefault();
        if(!this.state.showEmojiPicker){
            this.setState({
                showEmojiPicker:true
            });
        }else{
            this.setState({
                showEmojiPicker:false
            });
        }

    }

    mouseDownClickedHandler=()=>{
      this.setState({
        showEmojiPicker:false
      });
    }

    getEmojiData=(emoji, event)=>{
        console.log(emoji);
        var emojiText = emoji.colons;
        var emojiMessage = this.state.message.concat(" " + emojiText);
        console.log(emojiMessage);
        this.setState({
            message: emojiMessage
        });
    }

    render(){
        var writeLinkAttach = [Styles.WriteLink, Styles.Attach];
        var writeLinkSmiley = [Styles.WriteLink,Styles.Smiley];
        var writeLinkSend = [Styles.WriteLink,Styles.Send];
        var emPicker = (
            // <EmojiPicker onEmojiClick={(e)=>this.getEmojiData(e)}/>
            <Picker
                set='emojione'
                onClick={(emoji, event)=>this.getEmojiData(emoji, event)}
                style={{ position: 'absolute', bottom: '70px', right: '20px' }}
                />
        );
        return(
            <div>
                    <div className={Styles.Write}>
                        {/* eslint-disable-next-line */}
                        <a href="javascript:;" className={writeLinkAttach.join(' ')}></a>
                        <input type="text"
                            value={this.state.message}
                            onChange={this.inputChangeHandler}
                            onMouseDown={this.mouseDownClickedHandler}
                            onKeyPress={this.enterPressedHandler}
                        />
                        {/* eslint-disable-next-line */}
                        <a href="javascript:;" onClick={this.showEmojiPicker} className={writeLinkSmiley.join(' ')}></a>
                        {/* eslint-disable-next-line */}
                        <a href="javascript:;" onClick={this.sendClickedHandler} className={writeLinkSend.join(' ')}></a>
                    </div>
                    {this.state.showEmojiPicker ? emPicker : null}

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
