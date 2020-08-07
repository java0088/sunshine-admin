import React from 'react'
import {getLineList} from '../../server/service'
import echarts from 'echarts'
export default class Bar extends React.Component {
  state = {
    types:['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'],
    data:[]
  }
  componentDidMount() {
    this.getData()
  }
  getData = async () => {
    const res = await getLineList()
    let data = res.data.data
    console.log(res.data.data)
    this.setState({
      data
    })
    this.draw()
  }
  draw = () =>{
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(this.refs['myChart']);
   
    const colorList = ["#9E87FF", '#73DDFF', '#fe9a8b', '#F56948', '#9E87FF']
    let option = {
        backgroundColor: '#fff',
        title: {
            text: '热门分类一周播放数据',
            textStyle: {
                fontSize: 30,
                color:'#636670'
                // fontWeight: 400
            },
            left: 'center',
            top: '5%'
        },
        legend: {
            icon: 'circle',
            top: '5%',
            right: '5%',
            itemWidth: 6,
            itemGap: 20,
            textStyle: {
                color: '#556677'
            }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: "cross",
                label: {
                    show: true,
                    backgroundColor: '#fff',
                    color: '#556677',
                    borderColor: 'rgba(0,0,0,0)',
                    shadowColor: 'rgba(0,0,0,0)',
                    shadowOffsetY: 0
                },
                lineStyle: {
                  width: 10,
                  type: "solid",
                  color: 'rgba(136,156,229,0.2)'
                }
            },
            backgroundColor: '#fff',
            textStyle: {
                color: '#5c6c7c'
            },
            padding: [10, 10],
            extraCssText: 'box-shadow: 1px 0 2px 0 rgba(163,163,163,0.5)'
        },
        grid: {
            top: '20%'
        },
        xAxis: [{
            type: 'category',
            data: this.state.types,
            axisLine: {
                lineStyle: {
                    color: '#DCE2E8'
                }
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                interval: 0,
                textStyle: {
                    color: '#556677'
                },
                // 默认x轴字体大小
                fontSize: 12,
                // margin:文字到x轴的距离
                margin: 15
            },
            axisPointer: {
                label: {
                    // padding: [11, 5, 7],
                    padding: [0, 0, 10, 0],
                    margin: 15,
                    // 移入时的字体大小
                    fontSize: 12,
                    backgroundColor: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [{
                            offset: 0,
                            color: '#fff' // 0% 处的颜色
                        }, {
                            // offset: 0.9,
                            offset: 0.86,
                            color: '#fff' // 0% 处的颜色
                        }, {
                            offset: 0.86,
                            color: '#33c0cd' // 0% 处的颜色
                        }, {
                            offset: 1,
                            color: '#33c0cd' // 100% 处的颜色
                        }],
                        global: false // 缺省为 false
                    }
                }
            },
            boundaryGap: false
        }],
        yAxis: [{
            type: 'value',
            axisTick: {
                show: false
            },
            axisLine: {
                show: true,
                lineStyle: {
                    color: '#DCE2E8'
                }
            },
            axisLabel: {
                textStyle: {
                    color: '#556677'
                }
            },
            splitLine: {
                show: false
            }
        }, {
            type: 'value',
            position: 'right',
            axisTick: {
                show: false
            },
            axisLabel: {
                textStyle: {
                    color: '#556677'
                },
                formatter: '{value}'
            },
            axisLine: {
                show: true,
                lineStyle: {
                    color: '#DCE2E8'
                }
            },
            splitLine: {
                show: false
            }
        }],
        series: [
          {
              name: this.state.data[0].name,
              type: 'line',
              data: this.state.data[0].values,
              symbolSize: 1,
              symbol: 'circle',
              smooth: true,
              yAxisIndex: 0,
              showSymbol: false,
              lineStyle: {
                  width: 5,
                  color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                          offset: 0,
                          color: '#9effff'
                      },
                      {
                          offset: 1,
                          color: '#9E87FF'
                      }
                  ]),
                  shadowColor: 'rgba(158,135,255, 0.3)',
                  shadowBlur: 10,
                  shadowOffsetY: 20
              },
              itemStyle: {
                  normal: {
                      color: colorList[0],
                      borderColor: colorList[0]
                  }
              }
            }, {
                name: this.state.data[1].name,
                type: 'line',
                data: this.state.data[1].values,
                symbolSize: 1,
                symbol: 'circle',
                smooth: true,
                yAxisIndex: 0,
                showSymbol: false,
                lineStyle: {
                    width: 5,
                    color: new echarts.graphic.LinearGradient(1, 1, 0, 0, [{
                            offset: 0,
                            color: '#73DD39'
                        },
                        {
                            offset: 1,
                            color: '#73DDFF'
                        }
                    ]),
                    shadowColor: 'rgba(115,221,255, 0.3)',
                    shadowBlur: 10,
                    shadowOffsetY: 20
                },
                itemStyle: {
                    normal: {
                        color: colorList[1],
                        borderColor: colorList[1]
                    }
                }
            },
            {
                name: this.state.data[2].name,
                type: 'line',
                data: this.state.data[2].values,
                symbolSize: 1,
                yAxisIndex: 1,
                symbol: 'circle',
                smooth: true,
                showSymbol: false,
                lineStyle: {
                    width: 5,
                    color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                            offset: 0,
                            color: '#fe9a'
                        },
                        {
                            offset: 1,
                            color: '#fe9a8b'
                        }
                    ]),
                    shadowColor: 'rgba(254,154,139, 0.3)',
                    shadowBlur: 10,
                    shadowOffsetY: 20
                },
                itemStyle: {
                    normal: {
                        color: colorList[2],
                        borderColor: colorList[2]
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