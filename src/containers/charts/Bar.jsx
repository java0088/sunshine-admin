import React from 'react'
import {getBarList} from '../../server/service'
import echarts from 'echarts'
export default class Bar extends React.Component {
  state = {
    types:[],
    data:[]
  }
  componentDidMount() {
    this.getData()
  }
  getData = async () => {
    const res = await getBarList()
    let data = []
    let types = []
    res.data.types.forEach((item,index)=>{
      types.push(item.title)
      data.push(res.data.data[index].num)
    })
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
        text: '视频播放量',
        // subtext: '纯属虚构'
        textStyle:{
          fontSize:30,
          lineHeight: 30,
          color:'#636670'
        }
    },
    color: ['#5b77db'],
    tooltip: {
        trigger: 'axis',
        axisPointer:{
          type:'shadow',
          shadowStyle:{
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                  offset: 0, color: 'rgba(91,116,205,.1)' // 0% 处的颜色
              }, {
                  offset: 1, color: 'rgba(91,116,205,.2)' // 100% 处的颜色
              }],
              global: false // 缺省为 false
            }
        }
        },
        
    },
    grid: {
      top: '20%'
    },
    legend: {
        data: ['蒸发量', '降水量']
    },
    xAxis: [
        {
            type: 'category',
            data: this.state.types
        }
    ],
    yAxis: [
        {
            type: 'value'
        }
    ],
    series: [
        {
            name: '蒸发量',
            type: 'bar',
            data: this.state.data,
            barWidth:'30',
            markPoint: {
                data: [
                    {type: 'max', name: '最大值'},
                    {type: 'min', name: '最小值'}
                ]
            },
            markLine: {
                data: [
                    {type: 'average', name: '平均值'}
                ]
            }
        },
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