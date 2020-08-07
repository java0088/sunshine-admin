import {combineReducers} from 'redux'
import saveUser from './user_reducer'
import saveCate from './cate_reducer'

export default combineReducers({
  userInfo:saveUser,
  cateInfo:saveCate
})