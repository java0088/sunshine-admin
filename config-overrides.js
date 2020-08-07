const { override, fixBabelImports,addLessLoader,addDecoratorsLegacy } = require('customize-cra');
 
module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true, // 设置为true
  }),
  // 添加loader
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: { "@primary-color": "#586db7" } // 修改主题颜色
  }),
  addDecoratorsLegacy()
);