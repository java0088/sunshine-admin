import {SAVE_CATE} from '../action_types'
let initCateInfo = {
  title:'首页',
  path:'/home',
  icon:'home'
}
export default function saveCate(preState=initCateInfo,action) {
  const {type,data} = action
  switch(type) {
    case SAVE_CATE:
      return data
    default :
      return preState
  }
}