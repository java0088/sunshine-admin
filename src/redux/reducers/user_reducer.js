import {SAVE_USER} from '../action_types'
let initPersons = {
  username:'',
  password:'',
  isLogin:false
}
export default function saveUser(preState=initPersons,action) {
  const {type,data} = action
  switch(type) {
    case SAVE_USER:
      return data
    default :
      return preState
  }
}