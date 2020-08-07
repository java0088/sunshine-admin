import React from 'react'
import {getVideoList,deleteVideoById} from '../../server/service'
import { message,Card,Table,Button,Input,Modal} from 'antd'

import {BASE_URL} from '../../config/index'
import {getDate} from '../../assets/js/utils'

export default class Product extends React.Component {
  state = {
     list:[],
     total:0, 
     columns: [
      {
        title: '视频ID',
        dataIndex: 'id',
        align:'center',
      },
      {
        title: '用户昵称',
        dataIndex: 'nickname',
        align:'center',
      },
      {
        title: '用户手机号',
        dataIndex: 'mobile',
        align:'center',
      },
      {
        title: '视频内容',
        dataIndex: 'content',
        align:'center'
      },
      {
        title: '点赞量',
        dataIndex: 'love_num',
        align:'center',
      },
      {
        title: '发布时间',
        dataIndex: 'add_time',
        align:'center',
        width:'15%',
        render:(text, record)=><span>{getDate(text)}</span>
      },
      {
        title: '视频描述',
        dataIndex: 'description',
        align:'center',
        render:(text, record)=><span>{text!=='undefined'?text:''}</span>
      },
      {
        title: '视频封面',
        dataIndex: 'poster_url',
        align:'center',
        render: (text, record) => <img width="70" alt="true" height="80" src={BASE_URL+text}/>
      },
      {
        title: '操作',
        dataIndex: '',
        width:'10%',
        align:'center',
        render: (text, record) => (<div>
          <Button type="danger" onClick={()=>this.handleDeleteVideo(record.id)}>删除</Button></div>)
      }
    ],
    searchName:'',
    pageInfo:{
      page:1,
      pageSize:5
    },
    isLodding:false
  }
  componentDidMount() {
    this.getVideoList()
  }

  // 获取视频列表
  getVideoList = async () =>{
    this.setState({
      isLodding:true
    })
    const {pageInfo,searchName} = this.state
    const res = await getVideoList(searchName,pageInfo)
    if(res.status===1) {
      this.setState({
        list:res.data,
        pageInfo:res.pageInfo,
        isLodding:false
      })
      message.success(res.msg)
    }else {
      this.setState({
        list:[],
        isLodding:false
      })
      message.error(res.msg)
    }
  }

  handleSearchName = (e) =>{
    this.setState({
      searchName:e.target.value
    })
    if(e.target.value==='') {
      setTimeout(()=>{
        this.getVideoList()
      },100)
    }
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

  // 删除视频
  handleDeleteVideo=(id)=>{
      // 根据id删除视频
    Modal.confirm({
      title: '提示',
      content: '确定要删除该视频吗?',
      okText: '确认',
      cancelText: '取消',
      onCancel:()=>{
        console.log('我后悔了')
      },
      onOk:async ()=>{
        const res = await deleteVideoById(id)
        if(res.status===1) {
          message.success(res.msg)
          this.getCateList()
        }else {
          message.error(res.msg)
        }
      }
    })
  }
  render() {
    const {list,columns,searchName,pageInfo,isLodding} = this.state
    return (
      <div style={{ width: '100%',height:'100%' }}>
        {/* <Table dataSource={dataSource} columns={columns} />; */}
        <Card 
          title={<div><Input value={searchName} onChange={this.handleSearchName} onPressEnter={this.getVideoList}  allowClear={true} placeholder="请输入发布者姓名搜索" style={{width: '25%',marginRight:'12px'}} />
          <Button type="primary" icon="search" onClick={this.getVideoList}>搜索</Button></div>} 
          // extra={<Button type="primary" icon="plus" onClick={this.handleAddClick}>添加视频</Button>} 
          style={{ width: '100%',height:'80%'}}
          bordered={false}
        >
          <Table style={{width:'100%',height:'60%'}} loading={isLodding} rowKey={record=>record.id} dataSource={list} bordered={true} scroll={{y:true}} columns={columns} pagination={{...pageInfo,onChange:this.handlePageChange}}/>
        </Card>
      </div>
    )
  }
}