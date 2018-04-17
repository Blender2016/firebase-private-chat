import React, {Component} from "react";
import Styles from "./Left.module.css";
import {Badge} from "antd";
import {connect} from "react-redux";
import _ from "lodash";
import firebaseApp from "../../js/firebase";
import uuidv4 from "uuid/v4";
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';

TimeAgo.locale(en);
const timeAgo = new TimeAgo('en-US');

var database= firebaseApp.database();

class Left extends Component{
    state={
        users:[],
        chatWithUsers:[],
        filteredUsers:[]
    };

    componentWillMount(){
        database.ref('/users').on('value',(snapshot)=>{
            if(snapshot.val() !== null){
                this.getAllUsers(snapshot.val());
                this.getChatWithUsers();
            }
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

    getChatWithUsers=()=>{
        if(this.props.ownerId){
          let currentUser = _.filter(this.state.users,(user)=> { return (user.id === this.props.ownerId)})[0];
          if( currentUser && currentUser.hasOwnProperty('chatWith')){
              let chatwithUsersIdList = _.filter(this.state.users,(user)=> { return (user.id ===      this.props.ownerId)})[0].chatWith.map(item=>item.otherId);
              console.log('chatwithUsersIdList',chatwithUsersIdList);

              let chatwithUsers = _.map(chatwithUsersIdList,id=>{
                let usersList = this.state.users.filter(user=>user.id === id)[0];
                return(usersList);
              })

             console.log('chatwithUsers',chatwithUsers);

             this.setState({
               chatWithUsers:chatwithUsers
             });
          }
        }
    }


    filterUsers=(event)=> {
          event.preventDefault();
          const regex = new RegExp(event.target.value, 'i');
          const filtered = this.state.users.filter(user=> user.name.search(regex) > -1);
          this.setState({
            filteredUsers:filtered
          });
          console.log('filtered',filtered);

          if(!event.target.value){
            this.setState({
              filteredUsers:[]
            });
          }
    };

    unreadMessages = (chatWithList) =>{
        console.log('chatWithList :===>',chatWithList);
        let count;
        if(chatWithList){
            let index = chatWithList.findIndex(item => item.otherId === this.props.ownerId);
            console.log('unread INdex:==>',index);
            if(index !== -1){
                count = chatWithList[index].unread;
            }else{
                count =0;
            }
        }else{
            count = 0;
        }
        return count;
    }



    render(){

        var activeUser = [Styles.Person, Styles.active];
        console.log('userid',this.props.otherId);
        // let usersList = _.filter(this.state.filteredUsers,(user)=> { return (user.id !== this.props.ownerId)});
        let usersList = null;
        if(this.state.filteredUsers.length > 0){
          usersList = this.state.filteredUsers
        }else{
          usersList = this.state.chatWithUsers
        }
        var users = usersList.map(user=>(
                    <div
                    key={uuidv4()}
                    className={(this.props.otherId === user.id) ? activeUser.join(' ') : Styles.Person}
                    onClick={()=>this.props.userClicked(user)}>
                        <img src={user.imageUrl} alt="" />
                        {user.isOnline ? <Badge dot={true} style={{ backgroundColor: '#bae637',marginRight:'3px'}}/> : null}
                        <span className={Styles.Name}>{user.name}</span>
                        <span className={Styles.Time}>{user.loggedOutAt ? timeAgo.format( user.loggedOutAt) : null}</span>
                        <span className={Styles.Preview}>{user.isTyping ? "typing ..." : " status"}</span>
                        <Badge count={user.chatWith ? this.unreadMessages(user.chatWith) : 0 } className={Styles.Unread}
                        style={{ backgroundColor: '#87e8de', color: '#00b0ff', boxShadow: '0 0 0 1px #d9d9d9 inset' }} />
                    </div>
        ));
        return(
            <div className={Styles.Left}>
                <div className={Styles.Top}>
                    <input type="text" onChange={this.filterUsers} />
                    {/* eslint-disable-next-line */}
                    <a href="javascript:;" onClick={this.clicked} className={Styles.Search}/>
                </div>
                    <div className={Styles.People} style={{overflowY:'scroll',overflowX:'hidden', height:'500px'}} >
                        {users}
                    </div>
            </div>
        );
    }
}

const mapStateToProps = state =>{
    return {
        ownerId:state.Auth.ownerId,
        userImage:state.Auth.userImage,
        ownerName:state.Auth.ownerName,
        email:state.Auth.email,
        token:state.Auth.token,
        isOnline:state.Auth.isOnline,
        loggedOutAt:state.Auth.loggedOutAt
    }
}

export default connect(mapStateToProps)(Left);


/*
<div className={Styles.Person} onClick={this.clicked}>
                        <img src="https://s13.postimg.org/ih41k9tqr/img1.jpg" alt="" />
                        <Badge dot={true} style={{marginRight:'3px'}}/>
                        <span className={Styles.Name}>Thomas Bangalter</span>
                        <span className={Styles.Time}>2:09 PM</span>
                        <span className={Styles.Preview}>I was wondering...</span>
                        <Badge count={20} className={Styles.Unread}/>
                    </div>
*/
