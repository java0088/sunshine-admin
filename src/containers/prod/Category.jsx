import React from 'react'

// antd
import {Card,Table,Button,Input,message,Modal} from 'antd'

// 导入请求函数
import {getCategoryList,editCategoryById,deleteCategoryById} from '../../server/service.js'

export default class Category extends React.Component {
  state = {
    sideBarList: [],
    columns: [
      {
        title: 'ID',
        dataIndex: 'id',
        width:'12%'
      },
      {
        title: '分类名',
        dataIndex: 'title',
        width:'50%',
        align:'center'
      },
      {
        title: '操作',
        dataIndex: '',
        width:'25%',
        align:'center',
        render: (text, record) => (<div>
          <Button onClick={()=>this.handleEditCate(record)} type="primary">修改</Button>&nbsp;&nbsp;&nbsp;&nbsp;
          <Button type="danger" onClick={()=>this.handleDeleteCate(record.id)}>删除</Button></div>)
      }
    ],
    searchName:'', // 搜索字段
    pagination: {
      pageSize:7,
      total:9
    },
    rowSelection:{
      columnWidth:'600px'
    },
    visible:false,
    isAdd:true,
    addEditText:'',
    editCate:{}
  }
  componentDidMount() {
    this.getCateList()
  }
  // 获取分类列表
  getCateList = async () =>{
    const {searchName} = this.state
    const res = await getCategoryList(searchName)
    console.log(res)
    if(res.status!==1) {
      this.setState({
        sideBarList:[],
        pagination:{
          pageSize:7,
          total:0
        }
      })
      return message.error(res.msg);
    }

    this.setState({
      sideBarList:res.data,
      pagination:{
        pageSize:7,
        total:res.data.length
      }
    })
  }
  // 处理搜索文本变化
  handleSearchName = (e) => {
    this.setState({
      searchName:e.target.value
    })
    if(e.target.value==='') {
      setTimeout(()=>{
        this.getCateList()
      },100)
    }
  }

  // 点击添加按钮显示添加弹框
  handleAddClick = () =>{
    const visible = !this.state.visible
    this.setState({
      visible,
      isAdd:true,
      addEditText:''
    })
  }
  // 点击确定
  handleOk = async() =>{
    const {isAdd,editCate,addEditText} = this.state
    const visible = !this.state.visible
    if(isAdd) { // 添加
      console.log('添加')
      const res = await editCategoryById(0,addEditText)
      if(res.status===1) {
        message.success(res.msg)
      }else {
        message.error(res.msg)
      }
    }else { // 修改
      console.log('修改')
      const res = await editCategoryById(editCate.id,addEditText)
      if(res.status===1) {
        message.success(res.msg)
      }else {
        message.error(res.msg)
      }
    }
    this.setState({
      visible
    })
    this.getCateList()
  }
  // 点击取消
  handleCancel = () =>{
    const visible = !this.state.visible
    this.setState({
      visible
    })
  }

  // 点击显示编辑框
  handleEditCate = (item) => {
    const visible = !this.state.visible
    this.setState({
      visible,
      editCate:item,
      addEditText:item.title,
      isAdd:false
    })
    console.log(item)
  }
  // 记录添加和编辑文本框
  handleTextChange = (e) =>{
    this.setState({
      addEditText:e.target.value
    })
  }

  // 根据id删除分类
  handleDeleteCate = async (id) =>{
    Modal.confirm({
      title: '提示',
      content: '确定要删除该分类吗?',
      okText: '确认',
      cancelText: '取消',
      onCancel:()=>{console.log('我后悔了')},
      onOk:async ()=>{
        const res = await deleteCategoryById(id)
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
    const {sideBarList,columns,pagination,searchName,visible,isAdd,addEditText} = this.state
    return (
      <div style={{ width: '100%',height:'100%' }}>
        <Card 
          title={<div><Input value={searchName} onChange={this.handleSearchName} onPressEnter={this.getCateList}  allowClear={true} placeholder="请输入搜索关键字" style={{width: '25%',marginRight:'12px'}} />
          <Button type="primary" icon="search" onClick={this.getCateList}>搜索</Button></div>} 
          extra={<Button type="primary" icon="plus" onClick={this.handleAddClick}>添加商品</Button>} 
          style={{ width: '100%',height:'100%' }}
        >
          <Table  dataSource={sideBarList} columns={columns} pagination={pagination} rowKey={record=>record.id}/>
        </Card>

        {/* 添加分类框 */}
        <Modal
          title={isAdd?'添加分类':'修改分类'}
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          okText={isAdd?'添加分类':'修改分类'}
          cancelText="取消"
        >
          <div className="flex_align">
            <span>分类名: </span>
            <Input value={addEditText} allowClear={true} placeholder="请输入分类名" onChange={this.handleTextChange} style={{width: '60%',marginLeft:'12px'}}/>
          </div>
        </Modal>
      </div>
    )
  }
}