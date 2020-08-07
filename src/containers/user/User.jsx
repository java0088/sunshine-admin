import React from 'react'
import {Card,Table,Button,Input,message,Modal} from 'antd'
import {getUserList,deleteUserById,logoutUser} from '../../server/service'

import {BASE_URL} from '../../config/index'

export default class User extends React.Component {
  state = {
    list:[],
    columns: [
      {
        title: '用户ID',
        dataIndex: 'id',
        width:'6%'
      },
      {
        title: '用户手机号',
        dataIndex: 'mobile',
        align:'center'
      },
      {
        title: '用户昵称',
        dataIndex: 'nickname',
        align:'center'
      },
      {
        title: '工作',
        dataIndex: 'job',
        align:'center'
      },
      {
        title: '性别',
        dataIndex: 'gender',
        align:'center'
      },
      {
        title: '头像',
        dataIndex: 'icon',
        align:'center',
        render:(text,record)=>(
          <img width="60px" height="70px" src={BASE_URL+record.icon} alt="true"/>
        ) 
      },
      {
        title: '居住地',
        dataIndex: 'city',
        align:'center'
      },
      {
        title: '操作',
        dataIndex: '',
        width:'20%',
        align:'center',
        render: (text, record) => (<div>
          <Button type="primary" onClick={()=>this.handleLogoutUser(record)}>{record.level===0?'已注销':'注销'}</Button>&nbsp;&nbsp;&nbsp;
          <Button type="danger" onClick={()=>this.handleDeleteUser(record.id)}>删除</Button>
          </div>)
      }
    ],
    pageInfo:{
      page:1,
      pageSize:6
    },
    nickname:'',
    mobile:''
  }
  componentDidMount() {
    this.getUserList()
  }
  // 获取分类列表
  getUserList = async () =>{
    const {nickname,mobile,pageInfo} = this.state
    const res = await getUserList({nickname,mobile,...pageInfo})
    console.log(res)
    if(res.status!==1) {
      this.setState({
        list:[]
      })
      return message.error(res.msg);
    }
      this.setState({
        list:res.data,
        pageInfo:res.pageInfo
      })
      console.log(res.pageInfo)
  }
  // 分页改变
  handlePageChange = (e) =>{
    const {pageInfo} = this.state
    console.log(e)
    pageInfo.page = e
    this.setState({
      pageInfo
    })

    this.getUserList()
  }
  // 处理搜索文本变化
  handleNickname = (e) => {
    this.setState({
      nickname:e.target.value
    })
    if(e.target.value==='') {
      setTimeout(()=>{
        this.getUserList()
      },100)
    }
  }
  // 处理搜索文本变化
  handleMobile = (e) => {
    this.setState({
      mobile:e.target.value
    })
    if(e.target.value==='') {
      setTimeout(()=>{
        this.getUserList()
      },100)
    }
  }
  // 根据id删除反馈
  handleDeleteUser = async (id) =>{
    Modal.confirm({
      title: '提示',
      content: '确定要删除该分类吗?',
      okText: '确认',
      cancelText: '取消',
      onCancel:()=>{console.log('我后悔了')},
      onOk:async ()=>{
        const res = await deleteUserById(id)
        if(res.status===1) {
          message.success(res.msg)
          this.getUserList()
        }else {
          message.error(res.msg)
        }
      }
    })
  }
  handleLogoutUser = (item) => {
    let level = item.level===0?1:0
    let content = item.level===0?'确定要释放该用户吗?':'确定要注销该用户吗?'
    Modal.confirm({
      title: '提示',
      content: content,
      okText: '确认并通知该用户',
      cancelText: '取消',
      onCancel:()=>{console.log('我后悔了')},
      onOk:async ()=>{
        const res = await logoutUser({id:item.id,level})
        if(res.status===1) {
          message.success(res.msg)
          this.getUserList()
        }else {
          message.error(res.msg)
        }
      }
    })
  }  
  render() {
    const {list,columns,pageInfo,nickname,mobile} = this.state
    return (
      <div style={{ width: '100%',height:'100%' }}>
      <Card 
        title={<div>
          <span style={{marginRight:'6px'}}>用户名 :</span><Input value={nickname} onChange={this.handleNickname} onPressEnter={this.getFeedbackList}  allowClear={true} placeholder="请输入用户名" style={{width: '220px',marginRight:'12px'}} />
          <span style={{marginRight:'6px'}}>手机号 :</span><Input value={mobile} onChange={this.handleMobile} onPressEnter={this.getFeedbackList}  allowClear={true} placeholder="请输入手机号" style={{width: '220px',marginRight:'12px'}} />
        <Button type="primary" icon="search" onClick={this.getUserList}>搜索</Button></div>} 
        style={{ width: '100%',height:'100%' }}
      >
        <Table pagination={{...pageInfo,onChange:this.handlePageChange}}  dataSource={list} columns={columns} bordered={true} rowKey={record=>record.id}/>
      </Card>
    </div>
    )
  }
}