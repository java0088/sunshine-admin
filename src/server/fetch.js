import axios from 'axios'
import NProgress from 'nprogress'
import {BASE_URL} from '../config/index'

const instance = axios.create({
  baseURL: BASE_URL,
  timeout: 50000
})

// http request 拦截器
instance.interceptors.request.use(
  config => {
    NProgress.start()
    config.headers = {
      // 'Content-Type': 'application/x-www-form-urlencoded'
      'Content-Type': 'application/json'
    }
    return config
  },
  error => {
    
  }
)

// http responsse 拦截器
instance.interceptors.response.use(
  res => {
    NProgress.done()
    return res.data;
  },
  error => {
    
  }
)

export default instance