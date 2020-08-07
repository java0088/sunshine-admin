import React from 'react';
import Admin from './containers/admin/Admin.jsx'
import Login from './containers/login/Login.jsx'
import {Route,withRouter} from 'react-router-dom'
// redux
import {connect} from 'react-redux'
import {saveUserInfo} from './redux/actions/user_action'
// 自己的
import {autoLogin} from './server/service'
@connect(state=>(
  {
    userInfo:state.userInfo
  }
),{saveUserInfo})
class App extends React.Component {
  componentDidMount() {
    this.autoLogin()
  }
   // 自动登录
   autoLogin = async () => {
    const token = localStorage.getItem('token')||''
    if(token.trim().length<=0) {
      this.props.history.replace('/login')
    }
    const res = await autoLogin(token)
    if(res.status===1) {
      // 保存到redux中
      this.props.saveUserInfo({...res.user,isLogin:true})
    }else {
      this.props.history.replace('/login')
    } 
  }
  render() {
    return (
      <div className="app">
        <Route path="/login" component={Login}/>
        <Route path="/admin" component={Admin}/>
        <Route path="/" component={Admin}  exact/>
      </div>
    );
  }
}

export default withRouter(App);
