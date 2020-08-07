import React from 'react'

import {Card,Table,Button,Input,message,Modal} from 'antd'
import {getDate} from '../../assets/js/utils'
// 导入请求函数
import {deleteFeedbackById,getFeedbackList} from '../../server/service.js'
export default class Feedback extends React.Component {
  state = {
    list: [],
    columns: [
      {
        title: 'ID',
        dataIndex: 'id',
        width:'6%'
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
        title: '反馈类型',
        dataIndex: 'type',
        align:'center'
      },
      {
        title: '反馈内容',
        dataIndex: 'content',
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
          <Button onClick={()=>this.handleLookDetail(record)} type="primary">查看详情</Button>&nbsp;&nbsp;&nbsp;&nbsp;
          <Button type="danger" onClick={()=>this.handleDeleteFeed(record.id)}>删除</Button></div>)
      }
    ],
    nickname:'', // 搜索字段
    mobile:'',
    rowSelection:{
      columnWidth:'600px'
    },
    visible:false,
    detail:{},
    pageInfo:{
      page:1,
      pageSize:5
    },
  }
  componentDidMount() {
    this.getFeedbackList()
  }
  // 获取分类列表
  getFeedbackList = async () =>{
    const {nickname,mobile,pageInfo} = this.state
    const res = await getFeedbackList({nickname,mobile,...pageInfo})
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
  }
  // 处理搜索文本变化
  handleNickname = (e) => {
    this.setState({
      nickname:e.target.value
    })
    if(e.target.value==='') {
      setTimeout(()=>{
        this.getFeedbackList()
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
        this.getFeedbackList()
      },100)
    }
  }

  // 点击添加按钮显示添加弹框
  handleAddClick = () =>{
    const visible = !this.state.visible
    this.setState({
      visible
    })
  }
  // 点击确定
  handleOk = async() =>{
    const visible = !this.state.visible
    this.setState({
      visible
    })
  }
  // 点击取消
  handleCancel = () =>{
    const visible = !this.state.visible
    this.setState({
      visible
    })
  }

  // 点击显示编辑框
  handleLookDetail = (item) => {
    const visible = !this.state.visible
    this.setState({
      visible,
      detail:item
    })
    console.log(item)
  }
  // 根据id删除反馈
  handleDeleteFeed = async (id) =>{
    Modal.confirm({
      title: '提示',
      content: '确定要删除该分类吗?',
      okText: '确认',
      cancelText: '取消',
      onCancel:()=>{console.log('我后悔了')},
      onOk:async ()=>{
        const res = await deleteFeedbackById(id)
        if(res.status===1) {
          message.success(res.msg)
          this.getFeedbackList()
        }else {
          message.error(res.msg)
        }
      }
    })
  } 
  // 分页改变
  handlePageChange = (e) =>{
    const {pageInfo} = this.state
    pageInfo.page = e
    this.setState({
      pageInfo
    })

    this.getVideoList()
  } 
  render() {
    const {list,columns,pageInfo,nickname,visible,mobile,detail} = this.state
    return (
      <div style={{ width: '100%',height:'100%' }}>
        <Card 
          title={<div>
            <span style={{marginRight:'6px'}}>用户名 :</span><Input value={nickname} onChange={this.handleNickname} onPressEnter={this.getFeedbackList}  allowClear={true} placeholder="请输入用户名" style={{width: '220px',marginRight:'12px'}} />
            <span style={{marginRight:'6px'}}>手机号 :</span><Input value={mobile} onChange={this.handleMobile} onPressEnter={this.getFeedbackList}  allowClear={true} placeholder="请输入手机号" style={{width: '220px',marginRight:'12px'}} />
          <Button type="primary" icon="search" onClick={this.getFeedbackList}>搜索</Button></div>} 
          style={{ width: '100%',height:'100%' }}
        >
          <Table pagination={{...pageInfo,onChange:this.handlePageChange}}  dataSource={list} columns={columns} bordered={true} rowKey={record=>record.id}/>
        </Card>

        {/* 添加分类框 */}
        <Modal
          title='反馈详情'
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          okText='确定'
          cancelText="取消"
        >
          <div style={{fontSize:'20px',color:'#222'}}>
            <p className="flex_align" style={{borderBottom:'1px solid #eee',width:'100%',padding:'16px 0'}}>
              <span style={{display:'inline-block',width:'120px'}}>用户名:</span>
              {detail.nickname}
            </p>
            <p className="flex_align" style={{borderBottom:'1px solid #eee',width:'100%',padding:'16px 0'}}>
              <span style={{display:'inline-block',width:'120px'}}>用户手机号:</span>
              {detail.mobile}
            </p>
            <p className="flex_align" style={{borderBottom:'1px solid #eee',width:'100%',padding:'16px 0'}}>
              <span style={{display:'inline-block',width:'120px'}}>反馈类型:</span>
              {detail.type}
            </p>
            <p className="flex_align" style={{borderBottom:'1px solid #eee',width:'100%',padding:'16px 0'}}>
              <span style={{display:'inline-block',width:'120px'}}>反馈内容:</span>
              {detail.content}
            </p>
            <p className="flex_align" style={{borderBottom:'1px solid #eee',width:'100%',padding:'16px 0'}}>
              <span style={{display:'inline-block',width:'120px'}}>图片:</span>
              {detail.img&&detail.img.split(',').map(item=><img className="icon_img" key={item} alt=" " src={item}/>)}
            </p>
            <p className="flex_align" style={{width:'100%',padding:'16px 0'}}>
              <span style={{display:'inline-block',width:'120px'}}>发布时间:</span>
              {getDate(detail.add_time)}
            </p>
          </div>
        </Modal>
      </div>
    )
  }
}