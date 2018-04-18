import React, {Component} from "react";
import Styles from "./Right.module.css";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import Write from "../Write/Write";
// import _ from 'lodash';
import md5 from 'md5';
import {Menu, Dropdown, Icon, Avatar, Badge} from 'antd';
import uuidv4 from "uuid/v4";
import {emojify} from 'react-emojione';

// import firebaseApp from "../../js/firebase";

// var database= firebaseApp.database();

class Right extends Component {

  state={
    clear:false
  }

  scrollToBottom = () => {

    this.refs.elem.scrollTop = this.refs.elem.scrollHeight;
    // console.log('this.refs.elem.scrollHeight', this.refs.elem.scrollHeight);
    // console.log('this.refs.msg.clientHeight', this.refs.msg.clientHeight);
    // div.scrollTop = div.scrollHeight - div.clientHeight;
  }

  handleScroll = () => {
    console.log('this.refs.elem.scrollHeight', this.refs.elem.scrollHeight);
  }

  getUserName = (id) => {
    //get sender name
    let senderIndex = this.props.users.findIndex(user => id === user.id);
    if (senderIndex !== -1) {
      let senderName = this.props.users[senderIndex].name;
      return senderName;
    }

  }

  getUserImage = (id) => {
    //get sender name
    let senderIndex = this.props.users.findIndex(user => id === user.id);
    if (senderIndex !== -1) {
      let senderImage = this.props.users[senderIndex].imageUrl;
      return senderImage;
    }
  }

  getNumOfNotifications = () => {
    let notificationsNum = this.props.notifications.map(notification => notification.otherId === this.props.ownerId);
    // remove all falsy values and get length
    return notificationsNum.filter(Boolean).length
    // this.setState({
    //   notifications:notificationsNum.filter(Boolean).length
    // });
  }

  // removeAllNotification=(e)=>{
  //     e.preventDefault();
  //     let myNotifications = _.filter(this.props.notifications,notification => notification.otherId === this.props.ownerId);
  //     let notificationIdList = myNotifications.map(notification=> notification.id);
  //     console.log('notificationIdList',notificationIdList);
  //     notificationIdList.forEach(element => {
  //         console.log(element);
  //          database.ref(' /notifications/ ' + element).remove();
  //         database.ref('/notifications').child(element).remove().then(()=> {
  //              Code after remove
  //             console.log(element,'removed');
  //         });
  //     });
  // }

  getUserGavatar = (email) => {
    if (!email) {
      return null
    }
    let emailHash = md5(email.toLowerCase().trim());
    console.log('emailHash', emailHash);
    return `https://www.gravatar.com/avatar/${emailHash}?d=monsterid`
  }

  clearNotificationNum=()=>{
    this.setState({
      clear:true
    });
  }



  render() {

    var adminItem = (<Menu.Item>
      <Link to="/admin"><Icon type="dashboard" style={{
        marginRight: '5px'
      }}/>
        Admin Page</Link>
    </Menu.Item>);

    var admin = this.props.isAdmin
      ? adminItem
      : null;

    const menu = (<Menu>
      <Menu.Item>
        <Link to="/profile"><Icon type="user" style={{
        marginRight: '5px'
      }}/>User Profile</Link>
      </Menu.Item>
      {admin}
      <Menu.Item>
        <Link to="/logout"><Icon type="poweroff" style={{
        marginRight: '5px'
      }}/>Log out</Link>
      </Menu.Item>

    </Menu>);

    //   console.log('tohamy----->',this.props.notifications.map(notification=>notification.id));

    let notificationItems = this.props.notifications.map(notification => (
      notification.otherId === this.props.ownerId
      ? <Menu.Item key={uuidv4()}>
        <a href="#"><Avatar src={this.getUserImage(notification.ownerId)} style={{
          marginRight: '5px',
          height: '15px',
          width: '15px'
        }}/>
          <span style={{
              fontWeight: 'bold',
              color: '#bae637'
            }}>{this.getUserName(notification.ownerId)}</span>
          <span style={{
              color: '#1890ff',
              marginLeft: '5px'
            }}>send you a message
          </span>
        </a>
      </Menu.Item>
      : null));

    const allNotifications = (<Menu>
      {notificationItems}
      <Menu.Item >
        <a href="#" style={{
            textAlign: 'center'
          }} onClick={(e) => this.props.removeAllNotification(e)}>
          <Icon type="delete" style={{
              marginLeft: 'auto'
            }}/>
        </a>
      </Menu.Item>
    </Menu>);

    var bubbleYou = [Styles.Bubble, Styles.You];
    var bubbleMe = [Styles.Bubble, Styles.Me];
    var chat = [Styles.Chat, Styles.activeChat];

    var messages = this.props.messages.map(message => (<div key={uuidv4()} className={message.senderId === this.props.ownerId
        ? bubbleMe.join(' ')
        : bubbleYou.join(' ')} ref="msg">
      {/* {message.message} */}
      {emojify(message.message)}
    </div>));

    return (<div className={Styles.Right}>
      <div className={Styles.Top}>
        <span>To:
          <span className={Styles.Name}>
            <Avatar src={this.props.otherUserImage} style={{
                width: '25px',
                height: '25px'
              }}/> {this.props.otherName}</span>
        </span>

        <Dropdown overlay={allNotifications}>
          <a className="ant-dropdown-link" href="#" onMouseOver={this.clearNotificationNum} style={{
              marginLeft: '160px'
            }}>
            <Badge count={this.state.clear ? 0 : this.getNumOfNotifications()} style={{
                backgroundColor: '#bae637'
              }}>
              <Icon type="notification"/>
            </Badge>
          </a>
        </Dropdown>
        <Dropdown overlay={menu}>
          <a className="ant-dropdown-link" href="#" style={{
              float: 'right'
            }}>
            <Avatar src={this.props.userImage} style={{
                width: '25px',
                height: '25px'
              }}/>

            <Icon type="down"/>
          </a>
        </Dropdown>
      </div>
      <div className={chat.join(' ')} ref="elem" onScroll={this.handleScroll}>
        {messages}
      </div>
      <Write chatId={this.props.chatId} otherId={this.props.otherId} scrollToBottom={this.scrollToBottom}/>
    </div>);
  }
}

const mapStateToProps = state => {
  console.log('right', state);
  return {ownerId: state.Auth.ownerId, userImage: state.Auth.userImage, email: state.Auth.email, isAdmin: state.Auth.isAdmin}
}

export default connect(mapStateToProps)(Right);
