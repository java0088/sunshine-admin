
import React from 'react'
import {getPietList} from '../../server/service'
import echarts from 'echarts'
export default class Line extends React.Component {
  state = {
    types:[],
    data:[]
  }
  componentDidMount() {
    this.getData()
  }
  getData = async () => {
    const res = await getPietList()
    let data = []
    let types = []
    res.data.types.forEach((item,index)=>{
      types.push(item.title)
      data.push(res.data.data[index])
    })
    console.log(types)
    console.log(data)
    this.setState({
      types,
      data
    })
    this.draw()
  }
  draw = () =>{
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(this.refs['myChart']);
   
    let  option = {
        title: {
          text: '播放量统计--饼图',
          left: 'center',
          textStyle:{
            fontSize:30,
            color:'#636670'
          }
      },
      tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
      },
      grid: {
        top: '20%'
    },
      legend: {
          orient: 'vertical',
          left: 'left',
          data: this.state.types
      },
      series: [
          {
              name: '访问来源',
              type: 'pie',
              radius: '55%',
              center: ['50%', '60%'],
              data: this.state.data,
              emphasis: {
                  itemStyle: {
                      shadowBlur: 10,
                      shadowOffsetX: 0,
                      shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
              }
          }
      ]
    };
    // 绘制图表
    myChart.setOption(option);
  } 
  render() {
    return (
      <div className="flex_center" style={{width:'100%',height:'100%',cursor:'pointer'}}>
        <div ref="myChart" style={{width:'70vw',height:'65vh'}}>
        
        </div>
      </div>
    )
  }
}