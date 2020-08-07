import React from 'react'
// redux
import {connect} from 'react-redux'
import {saveUserInfo} from '../../redux/actions/user_action'

import {Redirect} from 'react-router-dom'
// antd
import { Form, Input, Button,Icon,message } from 'antd';

// 自己的
import {login} from '../../server/service.js'
import bgImg from '../../assets/images/bg8.jpg'
// 导入样式
import './login.less'
@connect(state=>(
  {
    userInfo:state.userInfo
  }
),{saveUserInfo})
@Form.create()
class Login extends React.Component {
  state = {
    username: '',
    password: '',
  }
  componentDidMount() {
    console.log(this.props)
  }
  loginSubmit = (e) => {
    this.props.form.validateFields(async (err,data)=>{
      if(err) {
        const {username,password} = err
        if(username) {
         return message.error(username.errors[0].message,1);
        }
        if(password) {
          return message.error(password.errors[0].message,1);
        }
      }else {
        const res = await login(data)
       if(res.status===1) { // 登录成功
          // 将token保存到本地
          localStorage.setItem('token',res.token)
          // 保存到redux中
          this.props.saveUserInfo({...res.user,isLogin:true})
          // 重置表单
          this.props.form.resetFields()
          message.success('登录成功!',1);
          // 跳转
          // this.props.history.replace('/admin')
       }else {
        message.error(res.msg);
       }
        
      }
    })
    e.preventDefault()
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { userInfo } = this.props;
    if(userInfo.isLogin) {
      return <Redirect to="/admin"/>
    }else 
    return (
     <div className="login" style={{backgroundImage:`url(${bgImg})`}}>
      {userInfo.username}
       <div className="header">
         <div className="logo"></div>
         <h1>后台管理系统</h1>
       </div>
       <div className="login_box">
       {/* <StepBackwardOutlined /> */}
         <h4>用户登录</h4>
        <Form name="normal_login" className="login-form" onSubmit={this.loginSubmit}>
            <Form.Item>
              {getFieldDecorator('username', {
                rules: [{required: true, message: '请输入用户名!'},{min: 3, message: '用户名长度必须大于3位'}],
              })(
                <Input
                  size="large"
                  prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="用户名"
                />,
              )}
            </Form.Item>

            <Form.Item>
              {getFieldDecorator('password', {
                rules: [{required: true, message: '请输入密码!'},{min: 3,max: 12, message: '密码长度必须在3到12位之间'}],
              })(
                <Input
                  size="large"
                  prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="密码"
                  type="password"
                />,
              )}
            </Form.Item>
            <div className="login_btn">
              <Button type="primary" size="large" block={true} htmlType="submit" style={{borderRadius:'8px'}}>
                登录
              </Button>
            </div>
          </Form>
       </div>
     </div>
    )
  }
}

export default Login