import React from 'react';
// 路由
import { Route, Switch } from 'react-router-dom';
// redux
import { connect } from 'react-redux';
import { saveUserInfo } from '../../redux/actions/user_action';
import { saveCateInfo } from '../../redux/actions/cate_action';
import axios from 'axios';
// antd
import { Button, Modal, Layout, Icon, Menu, message } from 'antd';
// 自己的
import { CATEGORY_LIST } from '../../config/index';
import User from '../user/User';
import Category from '../prod/Category';
import Product from '../prod/Product';
import Bar from '../charts/Bar';
import Pie from '../charts/Pie';
import Line from '../charts/Line';
import Roles from '../roles/Roles';
import Home from '../home/Home';
import Comment from '../feedback/comment';
import Feedback from '../feedback/feedback';
// import weatherImg from '../../assets/images/bg3.jpg'
import './admin.less';
const { confirm } = Modal;
const { Header, Footer, Sider, Content } = Layout;
const { SubMenu } = Menu;
@connect(
  (state) => ({
    userInfo: state.userInfo,
    cateInfo: state.cateInfo,
  }),
  { saveUserInfo, saveCateInfo }
)
class Admin extends React.Component {
  state = {
    isFull: false,
    city: '天津市',
    weather: {},
    weatherImg: 'weather sun',
    date: '',
    visible: false,
    timeId: null,
    defaultOpenKey: '/admin/home',
    expression: '',
  };
  componentDidMount() {
    this.getWeatcher();
    this.menuClick({ key: this.props.location.pathname });
    this.getCurrentTime()
  }
 
  componentWillReceiveProps() {}
  // 获取天气
  getWeatcher = async () => {
    // 获取城市
    let weatherImg = '';
    const res = await axios.get(
      'http://wthrcdn.etouch.cn/weather_mini?city=' + this.state.city
    );
    if (res.data.status === 1000) {
      const weather = res.data.data.forecast[0];
      console.log(weather);
      if (weather.type.indexOf('雨') !== -1) {
        weatherImg = 'weather rain';
      } else if (weather.type.indexOf('云') !== -1) {
        weatherImg = 'weather cloud';
      } else {
        weatherImg = 'weather sun';
      }
      this.setState({
        weather,
        weatherImg,
      });
    }
  };
  // 获取当前时间
  getCurrentTime = () => {
    let date = new Date();
    const y = date.getFullYear();
    const month = (date.getMonth() + 1);
    const d = date.getDate().toString();

    // const h = date.getHours().toString().padStart(2, '0');
    // const m = date.getMinutes().toString().padStart(2, '0');
    // const s = date.getSeconds().toString().padStart(2, '0');
    console.log('定时器')
    this.setState({
      date: `${y}年${month}月${d}日`,
    });
     
  };
  // 点击全屏
  fullScreen = () => {
    const isFull = !this.state.isFull;
    if (isFull) {
      console.log('全屏');
    } else {
      console.log('不全屏');
    }
    this.setState({
      isFull,
    });
  };
  // 退出登录
  logOut = () => {
    console.log(this.props.userInfo);
    confirm({
      title: '提示',
      content: '真的要退出吗?',
      cancelText: '取消',
      okText: '确定',
      onOk: () => {
        // 清除localStorage中的token
        localStorage.removeItem('token');
        // 删除redux中的用户信息
        this.props.saveUserInfo({ username: '', password: '', isLogin: false });
        // 跳转
        this.props.history.replace('/login');
      },
      onCancel() {
        console.log('取消退出登录');
      },
    });
  };
  // 点击导航
  menuClick = (item) => {
    if (item.key === '/admin'||item.key === '/') {
      item.key = '/admin/home';
    }
    let resArr = [];
    CATEGORY_LIST.forEach((item) => {
      resArr.push(item);
      if (item.children && item.children.length > 0) {
        item.children.forEach((child) => {
          resArr.push(child);
        });
      }
    });
    let cate = resArr.find(
      (ele) =>
        ele.path.indexOf(item.key.substring(item.key.lastIndexOf('/'))) !== -1
    );
    this.props.saveCateInfo(cate);
    this.props.history.push(item.key);
    console.log(item.key);
    let keyArr = item.key.split('/');
    // ''.lastIndexOf
    this.setState({
      defaultOpenKey: '/' + keyArr[1] + '/' + keyArr[2],
    });
  };
  // 计算器
  showCalculator = () => {
    this.setState({
      visible: !this.state.visible,
      expression: '',
    });
  };
  handleOk = () => {
    this.setState({
      visible: !this.state.visible,
      expression: '',
    });
  };
  handleCancel = () => {
    this.setState({
      visible: !this.state.visible,
      expression: '',
    });
  };
  collectNum = (num) => {
    this.refs['calInput'].focus();
    let reg = /^[1-9]$/;
    let { expression } = this.state;
    if (expression.length === 0 && !reg.test(num)) {
      message.error('数据不合法哟', 1);
      return;
    }
    expression += num;
    if(/\W{2}/.test(expression)) {
      console.log('含有两次非数字')
      return message.error('计算格式不对哟!', 1);
    }
    this.setState({
      expression,
    });
  };
  handleExChange = (e) => {
    this.setState({
      expression: e.target.value,
    });
  };
  calculateRes = () => {
    let { expression } = this.state;
    if (!/^[1-9]$/.test(expression[expression.length - 1])) {
      message.error('数据不合法哟', 1);
      return;
    }
    expression = expression.replace(/x/g, '*');
    expression = expression.replace(/÷/g, '/');
    if (expression.length > 0) {
      this.setState({
        expression: eval(expression),
      });
    }
  };
  cancelOne = () => {
    this.refs['calInput'].focus();
    let expression = this.state.expression.toString();
    if (expression.length === 0) return;
    expression = expression.substring(0, expression.length - 1);
    this.setState({
      expression,
    });
  };
  render() {
    const { isFull, weather, weatherImg, expression } = this.state;
    const { userInfo, cateInfo } = this.props;
    return (
      <Layout className="admin_box">
        <Sider className="slider">
          <div className="slider_box">
            <div className="title">
              <div className="logo"></div>
              <h1>阳光后台</h1>
            </div>
            <Menu
              defaultSelectedKeys={[
                this.props.location.pathname === '/admin'
                  ? '/admin/home'
                  : this.props.location.pathname,
              ]}
              defaultOpenKeys={[
                this.props.location.pathname.substring(
                  0,
                  this.props.location.pathname.lastIndexOf('/')
                ),
              ]}
              mode="inline"
              theme="dark"
              onClick={this.menuClick}
            >
              {CATEGORY_LIST.map((item) => {
                if (item.children.length > 0) {
                  return (
                    <SubMenu
                      key={'/admin' + item.path}
                      title={
                        <span>
                          <Icon type={item.icon} />
                          <span>{item.title}</span>
                        </span>
                      }
                    >
                      {item.children.map((item2) => (
                        <Menu.Item key={'/admin' + item.path + item2.path}>
                          {' '}
                          <Icon type={item2.icon} />
                          <span>{item2.title}</span>
                        </Menu.Item>
                      ))}
                    </SubMenu>
                  );
                }
                return (
                  <Menu.Item key={'/admin' + item.path}>
                    <Icon type={item.icon} />
                    <span>{item.title}</span>
                  </Menu.Item>
                );
              })}
            </Menu>
          </div>
        </Sider>
        <Layout>
          <Header className={isFull ? 'hid' : 'header'}>
            <div className="header_box">
              <div className="top">
                <Button
                  type="primary"
                  size="small"
                  onClick={this.showCalculator}
                >
                  计算器
                </Button>
                &nbsp;&nbsp;&nbsp;
                <Button size="small" onClick={this.fullScreen}>
                  <Icon
                    type={isFull ? 'fullscreen' : 'fullscreen-exit'}
                    style={{ fontWeight: 700 }}
                  />
                </Button>
                <p className="tips">欢迎, {userInfo.username}</p>
                <Button type="link" onClick={this.logOut}>
                  退出
                </Button>
              </div>
              <div className="bom flex_bea">
                <div className="title">{cateInfo.title}</div>
                <div className="flex_align">
                  <p>{this.state.date}</p>
                  <div className={weatherImg}>
                    <span className="icon"></span>
                  </div>
                  {/* <Icon type="cloud" theme="filled" /> */}
                  <span style={{ marginRight: 10 }}>{weather.type}</span>
                  <span>
                    {weather.low}~{weather.high}
                  </span>
                </div>
              </div>
              <Modal
                title="迷你计算器--纯属娱乐"
                visible={this.state.visible}
                onOk={this.handleOk}
                okText="确定"
                cancelText="取消"
                onCancel={this.handleCancel}
                bodyStyle={{ backgroundColor: '#fff' }}
              >
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#fff',
                  }}
                >
                  <div className="cal_box">
                    <div className="input_box">
                      <input
                        ref="calInput"
                        type="text"
                        value={expression}
                        onChange={this.handleExChange}
                      />
                    </div>
                    <span className="button">
                      <Icon type="font-colors" style={{ color: '#586db7' }} />
                    </span>

                    <span
                      onClick={() => this.collectNum('%')}
                      className="button theme_color"
                    >
                      %
                    </span>
                    <span
                      onClick={() => this.collectNum('÷')}
                      className="button"
                      style={{ color: '#586db7', fontSize: '30px' }}
                    >
                      ÷
                    </span>
                    <span
                      onClick={this.cancelOne}
                      className="button theme_color"
                    >
                      <Icon type="close-square" />
                    </span>
                    <span
                      onClick={() => this.collectNum('7')}
                      className="button"
                    >
                      7
                    </span>
                    <span
                      onClick={() => this.collectNum('8')}
                      className="button"
                    >
                      8
                    </span>
                    <span
                      onClick={() => this.collectNum('9')}
                      className="button"
                    >
                      9
                    </span>
                    <span
                      onClick={() => this.collectNum('x')}
                      className="button theme_color"
                    >
                      <Icon type="close" style={{ fontSize: '20px' }} />
                    </span>
                    <span
                      onClick={() => this.collectNum('4')}
                      className="button"
                    >
                      4
                    </span>
                    <span
                      onClick={() => this.collectNum('5')}
                      className="button"
                    >
                      5
                    </span>
                    <span
                      onClick={() => this.collectNum('6')}
                      className="button"
                    >
                      6
                    </span>
                    <span
                      onClick={() => this.collectNum('-')}
                      className="button theme_color"
                    >
                      <Icon type="minus" />
                    </span>
                    <span
                      onClick={() => this.collectNum('1')}
                      className="button"
                    >
                      1
                    </span>
                    <span
                      onClick={() => this.collectNum('2')}
                      className="button"
                    >
                      2
                    </span>
                    <span
                      onClick={() => this.collectNum('3')}
                      className="button"
                    >
                      3
                    </span>
                    <span
                      onClick={() => this.collectNum('+')}
                      className="button theme_color"
                    >
                      <Icon type="plus" />
                    </span>
                    <span
                      onClick={() => this.collectNum('0')}
                      className="button button-0"
                    >
                      0
                    </span>
                    <span
                      onClick={() => this.collectNum('.')}
                      className="button"
                    >
                      .
                    </span>
                    <span
                      onClick={this.calculateRes}
                      className="button theme_color"
                      style={{ fontSize: '30px' }}
                    >
                      =
                    </span>
                  </div>
                </div>
              </Modal>
            </div>
          </Header>
          <Content className="content">
            <div className="full_btn">
              <Button
                size="small"
                onClick={this.fullScreen}
                style={{ display: isFull ? 'block' : 'none' }}
              >
                <Icon
                  type={isFull ? 'fullscreen' : 'fullscreen-exit'}
                  style={{ fontWeight: 700 }}
                />
              </Button>
            </div>
            <div className="box">
              <Switch>
                <Route path="/admin/user" component={User} />
                <Route path="/admin/home" component={Home} />
                <Route path="/admin" exact component={Home} />
                <Route path="/admin/roles" component={Roles} />
                <Route path="/admin/videos/product" component={Product} />
                <Route path="/admin/videos/category" component={Category} />
                <Route path="/admin/fankui/feedback" component={Feedback} />
                <Route path="/admin/fankui/comment" component={Comment} />
                <Route path="/admin/charts/bar" component={Bar} />
                <Route path="/admin/charts/line" component={Line} />
                <Route path="/admin/charts/pie" component={Pie} />
              </Switch>
            </div>
          </Content>
          <Footer className="footer">
            使用谷歌浏览器, 可以获得更好的用户体验
          </Footer>
        </Layout>
      </Layout>
    );
  }
}
export default Admin;
