import React,{Component} from "react";
import Styles from "./Admin.module.css";
// import {connect} from "react-redux";
import firebaseApp from "../../js/firebase";
import axios from "../../axios_base";
import {Link} from "react-router-dom";
// import uuidv4 from "uuid/v4";
// import {withRouter} from "react-router-dom";
import _ from "lodash";
import { Table, Icon, Divider ,Popconfirm,Avatar,Badge,message,Spin} from 'antd';

var database= firebaseApp.database();


class Admin extends Component{
    state={
        data:[],
        loading:false
    }

    componentWillMount(){
        //get all users
        database.ref('/users').on('value',(snapshot)=>{
            if(snapshot.val() !== null){
                this.getAllUsers(snapshot.val());
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

        const userData=[];
        users.map(user => {
            userData.push({
                key:user.id,
                image:<Avatar src={user.imageUrl}/>,
                name:user.name,
                status:user.isOnline ? <Badge status="processing" /> : <Badge status="default" />
            })
        });

        this.setState({
            data:userData
        });
  
    }

    
  

    onDelete = (key) => {
        console.log(key);
        this.setState({
            loading:true
        });
        //delete user from database
        axios.delete(`/remove/${key}`).then(res=>{
            console.log(res.data);
            database.ref('/users').child(key).remove().then(()=>{
                this.setState({
                    loading:false
                });
                message.success('user deleted ');
                
            });
        }).catch(err =>{
            console.log(err);
            this.setState({
                loading:false
            });
            message.error('user not deleted ');
            
        });

        //delete user from firebase


        //delete user from table
        const dataSource = [...this.state.data];
        this.setState({ data: dataSource.filter(item => item.key !== key) });
      }

    render(){

        const columns = [{
            title: 'image',
            dataIndex: 'image',
            key: 'image',
            render: text => <a href="#">{text}</a>,
          }, {
            title: 'name',
            dataIndex: 'name',
            key: 'name',
          }, {
            title: 'status',
            dataIndex: 'status',
            key: 'status',
          }, {
            title: '',
            dataIndex: 'operation',
            render: (text, record) => {
              return (
                  <Popconfirm title="Sure to delete?" onConfirm={() => this.onDelete(record.key)}>
                    <a href="#"><Icon type="delete" /></a>
                  </Popconfirm>
              );
            }}];

            console.log(this.state.data);

          
          
        return(
            <div className={Styles.Wrapper}>
                <div className={Styles.Container}>
                <p className={Styles.credit}>   <Link to="/chat"  
                                className={Styles.Link}> Goto chat </Link></p>
                    <Spin spinning={this.state.loading}>
                        <Table style={{margin:'10px'}}  pagination={{ pageSize: 10 }} columns={columns} dataSource={this.state.data} />
                    </Spin>
                </div>
            </div>
        );
    }
}

export default Admin;