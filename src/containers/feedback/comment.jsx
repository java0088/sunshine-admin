import React from 'react'
import {Card,Table,Button,Input,message,Modal} from 'antd'
import {getDate} from '../../assets/js/utils'
import {getCommentList,deleteCommentById} from '../../server/service'

export default class Comment extends React.Component {
  state = {
    list:[],
    columns: [
      {
        title: '评论ID',
        dataIndex: 'id',
        width:'6%'
      },
      {
        title: '视频ID',
        dataIndex: 'v_id',
        align:'center'
      },
      {
        title: '用户名',
        dataIndex: 'nickname',
        align:'center'
      },
      {
        title: '用户手机号',
        dataIndex: 'mobile',
        align:'center'
      }, 
      {
        title: '点赞数',
        dataIndex: 'love_num',
        align:'center'
      },
      {
        title: '视频内容',
        dataIndex: 'txt',
        align:'center'
      },
      {
        title: '时间',
        dataIndex: 'add_time',
        align:'center',
        width:'15%',
        render:(text, record)=><span>{getDate(text)}</span>
      },
      {
        title: '操作',
        dataIndex: '',
        width:'25%',
        align:'center',
        render: (text, record) => (<div>
          <Button type="danger" onClick={()=>this.handleDeleteComment(record.id)}>删除</Button></div>)
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
    this.getCommentList()
  }
  // 获取分类列表
  getCommentList = async () =>{
    const {nickname,mobile,pageInfo} = this.state
    const res = await getCommentList({nickname,mobile,...pageInfo})
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

    this.getCommentList()
  }
  // 处理搜索文本变化
  handleNickname = (e) => {
    this.setState({
      nickname:e.target.value
    })
    if(e.target.value==='') {
      setTimeout(()=>{
        this.getCommentList()
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
        this.getCommentList()
      },100)
    }
  }
  // 根据id删除反馈
  handleDeleteComment = async (id) =>{
    Modal.confirm({
      title: '提示',
      content: '确定要删除该分类吗?',
      okText: '确认',
      cancelText: '取消',
      onCancel:()=>{console.log('我后悔了')},
      onOk:async ()=>{
        const res = await deleteCommentById(id)
        if(res.status===1) {
          message.success(res.msg)
          this.getCommentList()
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
        <Button type="primary" icon="search" onClick={this.getCommentList}>搜索</Button></div>} 
        style={{ width: '100%',height:'100%' }}
      >
        <Table pagination={{...pageInfo,onChange:this.handlePageChange}}  dataSource={list} columns={columns} bordered={true} rowKey={record=>record.id}/>
      </Card>
    </div>
    )
  }
}