const darkTheme = require('@ant-design/dark-theme').default;
const { override, fixBabelImports, addLessLoader } = require('customize-cra');

module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true,
  }),
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: {
      ...darkTheme,
      '@link-color': '#E3E3E3',
      '@avatar-bg': '#404041',
      '@layout-footer-background': '#001529',
    },
  }),
);
