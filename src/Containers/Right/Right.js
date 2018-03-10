import React ,{Component} from "react";
import Styles from "./Right.module.css";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import Write from "../Write/Write";
import { Menu, Dropdown, Icon } from 'antd';
import uuidv4 from "uuid/v4";


class Right extends Component{
    state={};
    //this.props.messages

    render(){

        const menu = (
            <Menu>
              <Menu.Item>
                <Link to="/profile"><Icon type="user" style={{marginRight:'5px'}}/>User Profile</Link>
              </Menu.Item>
              <Menu.Item>
                <Link to="/logout"><Icon type="poweroff" style={{marginRight:'5px'}}/>Log out</Link>
              </Menu.Item>
            </Menu>
          );

        var bubbleYou = [Styles.Bubble, Styles.You];
        var bubbleMe = [Styles.Bubble, Styles.Me];
        var chat = [Styles.Chat, Styles.activeChat];

        var messages = this.props.messages.map(message=>(
            <div key={uuidv4()} className={message.senderId === this.props.ownerId ? bubbleMe.join(' ') : bubbleYou.join(' ')}>
                {message.message}
            </div> 
        ));

        return(
            <div className={Styles.Right}>
                <div className={Styles.Top}>
                <span>To: <span className={Styles.Name}>Dog Woofson</span></span>
                <Dropdown overlay={menu} >
                    <a className="ant-dropdown-link" href="#" style={{float: 'right'}}>
                        Hover me <Icon type="down" />
                    </a>
                </Dropdown>
                </div>
                <div className={chat.join(' ')}>
                    {messages}
                </div>
                <Write chatId={this.props.chatId} otherId={this.props.otherId}/>
            </div>
        );
    }
}

const mapStateToProps = state =>{
    return{
        ownerId : state.Auth.ownerId
    }
}

export default connect(mapStateToProps)(Right);


/*
<div className={Styles.ConversationStart}>
                        <span>Today, 6:48 AM</span>
                    </div>
                    <div className={bubbleYou.join(' ')}>
                        Hello,
                    </div>
                    <div className={bubbleYou.join(' ')}>
                        it's me.
                    </div>
                    <div className={bubbleYou.join(' ')}>
                        I was wondering...
                    </div>
                    <div className={bubbleMe.join(' ')}>
                    ... about who we used to be.
                    </div>
                    <div className={bubbleMe.join(' ')}>
                        Are you serious?
                    </div>
*/