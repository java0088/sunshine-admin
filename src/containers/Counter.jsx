import React from 'react'
import {connect} from 'react-redux'
import {incrementCouter,decrementCouter,incrementCouterAsync} from '../redux/actions/counter_action'
import {addPerson} from '../redux/actions/person_action'
import {Button,Select,Input} from 'antd'
const {Option} = Select
class Couter extends React.Component {
  state = {
    num:1,
    name:''
  }
  componentDidMount() {
    console.log(this.props)
  }
  handleSelect = (value) => {
    this.setState({
      num:value
    })
  }
  // 增加
  increment = () => {
    this.props.increment(this.state.num)
  } 
  // 减少
  decrement = () => {
    this.props.decrement(this.state.num)
  }
  // 如果是奇数加
  incrementIfOdd = () => {
    if(this.props.count%2!==0) {
      this.props.increment(this.state.num)
    }
  }
  // 异步加
  incrementAsync = () => {
   this.props.incrementAsync(this.state.num,1000)
  }
  handleNmaeChange = (e) => {
    this.setState({
      name:e.target.value
    })
  }
  addPerson = () => {
    let person = {
      id:1,
      name:this.state.name
    }
    this.props.addPerson(person)
  }
  render() {
    const {num,name} = this.state
    return (
      <div>
        
        <h1>这是Couter组件,当前Coute的值为:{this.props.count}</h1>
        <h2>当前人数:{this.props.persons.map(item=><p>{item.name}</p>)}</h2>
        <Input value={name} onChange={this.handleNmaeChange} placeholder="请输入姓名"/> &nbsp;&nbsp;&nbsp; <Button onClick={this.addPerson} type="primary">添加</Button>
        <Select defaultValue={num} style={{ width: 120 }} onSelect={this.handleSelect} allowClear>
          <Option value={1}>1</Option>
          <Option value={2}>2</Option>
          <Option value={3}>3</Option>
        </Select>&nbsp;&nbsp;&nbsp;
        <Button onClick={this.increment} type="primary">+</Button>&nbsp;&nbsp;&nbsp;
        <Button onClick={this.decrement} type="danger">-</Button>&nbsp;&nbsp;&nbsp;
        <Button onClick={this.incrementIfOdd} type="ghost">奇数 +</Button>&nbsp;&nbsp;&nbsp;
        <Button onClick={this.incrementAsync} type="primary">异步 +</Button>&nbsp;&nbsp;&nbsp;
      </div>
    )
  }
}

export default connect(state=>(
  {
    count:state.count,
    persons:state.persons
  }
),{increment:incrementCouter,decrement:decrementCouter,incrementAsync:incrementCouterAsync,addPerson})(Couter)