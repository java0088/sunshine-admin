// 配置文件
export const theme1 =  {
  color:'#586db7',
  headerBgColor:'rgba(82,104,178,0.8)',
  bgImg: '../../assets/images/bg8.jpg'
}
export const BASE_URL = 'http://localhost:3520/'
// export const BASE_URL = 'http://39.107.99.4:3520/'
export const CATEGORY_LIST = [
  {path:'/home',title:'首页',icon:'home',children:[]},
  {path:'/videos',title:'视频',icon:'appstore',children:[ 
    {path:'/category',title:'分类管理',icon:'unordered-list'},
    {path:'/product',title:'视频管理',icon:'tool'}
  ]},
  {path:'/roles',icon:'check-circle',title:'角色管理',children:[
    
  ]},
  {path:'/fankui',icon:'check-circle',title:'反馈',children:[
    {path:'/comment',title:'视频评论',icon:'message'},
    {path:'/feedback',title:'用户反馈',icon:'solution'}
  ]},
  {path:'/user',icon:'user',title:'用户管理',children:[]},
  {path:'/charts',icon:'area-chart',title:'图形图表',children:[
    {path:'/bar',icon:'bar-chart',title:'柱状图'},
    {path:'/line',icon:'line-chart',title:'折线图'},
    {path:'/pie',icon:'pie-chart',title:'圆形图'}
  ]},
]