import React from 'react'

// antd
import {Card,Table,Button,Input,message,Modal,Tree} from 'antd'

// 导入请求函数
import {getAdminList,addRole,setRoles} from '../../server/service.js'
import {connect} from 'react-redux'
import {getDate} from '../../assets/js/utils'
import {CATEGORY_LIST} from '../../config/index'
const Menu = [{title:'功能',path:'/admin',children:CATEGORY_LIST}]
const {TreeNode} = Tree
@connect(state=>(
  {
    userInfo:state.userInfo
  }
),{})
class Roles extends React.Component {
  state = {
    sideBarList: [],
    columns: [
      {
        title: '角色名称',
        dataIndex: 'username',
      },
      {
        title: '创建时间',
        dataIndex: 'add_time',
        align:'center',
        render:(text, record)=><span>{getDate(text)}</span>
      },
      {
        title: '授权时间',
        dataIndex: 'auth_time',
        render:(text, record)=><span>{getDate(text)}</span>,
        align:'center'
      },
      {
        title: '授权人',
        dataIndex: 'auth_name',
        align:'center'
      },
      {
        title: '操作',
        dataIndex: '',
        align:'center',
        render: (text, record) => <Button onClick={()=>this.handleEditCate(record)} type="primary">设置权限</Button>
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
    addVisible:false,
    setVisible:false,
    addEditText:'',
    editCate:{},
    checkedKeys:[],
    currentSetId:0
  }
  componentDidMount() {
    this.getAdminList()
  }
  // 获取分类列表
  getAdminList = async () =>{
    const res = await getAdminList(this.state.pagination)
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
      pagination:res.pageInfo
    })
  }
  // 处理搜索文本变化
  handleSearchName = (e) => {
    this.setState({
      searchName:e.target.value
    })
    if(e.target.value==='') {
      setTimeout(()=>{
        this.getAdminList()
      },100)
    }
  }

  // 点击添加按钮显示添加弹框
  handleAddClick = () =>{
    const addVisible = !this.state.addVisible
    this.setState({
      addVisible,
      addEditText:''
    })
  }
  // 点击确定添加角色
  handleAddOk = async() =>{
    const addVisible = !this.state.addVisible
    if(this.state.addEditText.trim().length<=0) {
      return  message.error('请输入角色名称!');
    }
    const res =  await addRole({auth_id:this.props.userInfo.id,username:this.state.addEditText})
    if(res.status!==1) {
      return message.error(res.msg);
    }
    this.setState({
      addVisible
    })
    this.getAdminList()
  }
  // 点击取消添加角色
  handleAddCancel = () =>{
    const addVisible = !this.state.addVisible
    this.setState({
      addVisible
    })
  }

   // 点击确定设置权限
  handleSetOk = async () =>{
    const setVisible = !this.state.setVisible
    const {checkedKeys,currentSetId} = this.state
    if(checkedKeys.length>0) {
      const auth_id = this.props.userInfo.id
      const res = await setRoles({id:currentSetId,auth_id,roles:checkedKeys})
      message.success(res.msg)
      if(res.status===1) {
        this.setState({
          setVisible
        })
        this.getAdminList()
      }else {
        message.error(res.msg)
      }
    }else {
      message.error('请选择权限')
    }
    
  }
  // 点击取消设置权限
  handleSetCancel = () =>{
    const setVisible = !this.state.setVisible
    this.setState({
      setVisible
    })
  }
  // 点击显示编辑框
  handleEditCate = (item) => {
    const setVisible = !this.state.setVisible
    let checkedKeys = []
    if(item.id===1) {
      checkedKeys[0] = '/admin'
    }
    if(item.roles.length>0) {
      checkedKeys = item.roles.split(',')
    }
    this.setState({
      setVisible,
      currentSetId:item.id,
      checkedKeys:checkedKeys
    })
  }
  // 记录添加和编辑文本框
  handleTextChange = (e) =>{
    this.setState({
      addEditText:e.target.value
    })
  }
  renderTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.path} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.path} {...item} />;
    })
  onCheck = checkedKeys => {
    console.log('onCheck', checkedKeys.toString());
    this.setState({ checkedKeys });
  }
   // 分页改变
   handlePageChange = (e) =>{
    const {pagination} = this.state
    pagination.page = e
    this.setState({
      pagination
    })

    this.getAdminList()
  }
  
  render() {
    const {sideBarList,columns,pagination,addVisible,setVisible,addEditText} = this.state
   
    return (
      <div style={{ width: '100%',height:'100%' }}>
        <Card
          title={<Button type="primary" icon="plus" onClick={this.handleAddClick}>添加角色</Button>} 
          style={{ width: '100%',height:'100%' }}
        >
          <Table  dataSource={sideBarList} bordered={true} columns={columns} pagination={{...pagination,onChange:this.handlePageChange}} rowKey={record=>record.id}/>
        </Card>

        {/* 添加分类框 */}
        <Modal
          title="添加角色"
          visible={addVisible}
          onOk={this.handleAddOk}
          onCancel={this.handleAddCancel}
          okText="添加角色"
          cancelText="取消"
        >
          <div className="flex_align">
            <span>角色名: </span>
            <Input value={addEditText} allowClear={true} placeholder="请输入角色名" onChange={this.handleTextChange} style={{width: '60%',marginLeft:'12px'}}/>
          </div>
        </Modal>

        {/* 设置权限框 */}
        <Modal
          title="设置权限"
          visible={setVisible}
          onOk={this.handleSetOk}
          onCancel={this.handleSetCancel}
          okText='确定'
          cancelText="取消"
        >
          <div className="flex_align">
            <Tree
              checkable
              onCheck={this.onCheck}
              checkedKeys={this.state.checkedKeys}
              defaultExpandAll={true}
            >
              {this.renderTreeNodes(Menu)}
            </Tree>
          </div>
        </Modal>
      </div>
    )
  }
}

export default Roles