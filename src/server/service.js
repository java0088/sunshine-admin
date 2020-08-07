import Myaxios from './fetch'

// 用户名密码登录
export const login = ({username,password}) => {
  return Myaxios.post('/admin/login',{username,password})
}
// 自动登录
export const autoLogin = (token) => {
  return Myaxios.post('/admin/autoLogin',{token})
}

// 获取分类列表
export const getCategoryList = (searchName) => {
  return Myaxios.get('/category/list?searchName='+searchName)
}

// 添加和修改分类
export const editCategoryById = (id=0,title='') => {
  return Myaxios.post('/category/edit',{id,title})
}

// 删除分类
export const deleteCategoryById = (id) => {
  return Myaxios.delete('/category/delete?id='+id)
}

// 获取视频列表
export const getVideoList = (searchName='',pageInfo) => {
  return Myaxios.post('/video/list?searchName='+searchName,pageInfo)
}

// 删除视频
export const deleteVideoById = (id) => {
  return Myaxios.delete('/video/delete?id='+id)
}

// 获取反馈列表
export const getFeedbackList = (data) => {
  return Myaxios.post('/feedback/list',data)
}

// 删除反馈
export const deleteFeedbackById = (id) => {
  return Myaxios.delete('/feedback/delete?id='+id)
}

// 获取评论列表
export const getCommentList = (data) => {
  return Myaxios.post('/comment/list',data)
}

// 删除评论
export const deleteCommentById = (id) => {
  return Myaxios.delete('/comment/delete?id='+id)
}

// 获取柱状图数据
export const getBarList = () => {
  return Myaxios.get('/charts/getBarList')
}

// 获取饼图数据
export const getPietList = () => {
  return Myaxios.get('/charts/getPieList')
}

// 获取折线图数据
export const getLineList = () => {
  return Myaxios.get('/charts/getLineList')
}


// 获取用户列表
export const getUserList = (data) => {
  return Myaxios.post('/user/list',data)
}

// 删除用户
export const deleteUserById = (id) => {
  return Myaxios.delete('/user/delete?id='+id)
}

// 注销用户
export const logoutUser = (data) => {
  return Myaxios.post('/user/logoutUser',data)
}

// 获取管理员列表
export const getAdminList = (data) => {
  return Myaxios.post('/admin/list',data)
}

// 获取添加管理员
export const addRole = (data) => {
  return Myaxios.post('/admin/add',data)
}

// 设置管理员权限
export const setRoles = (data) => {
  return Myaxios.post('/admin/setRoles',data)
}
