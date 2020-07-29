module.exports = {
  // 指定主题（主题配置文件放置于 themes 文件夹下）
  'theme': 'antd.default',
  // 模拟，联调数据设置
  'mock': {
    // 是否需要反向代理，启用则需配置代理前缀，如：/api
    'ReverseProxy': true,
    // 模拟，联调数据服务端口号
    'port': 3000,
    // 反向代理前缀（代理规则）
    'proxyPath': '/api',
    // 反向代理主机地址
    'proxyTarget': 'http://localhost:3001/'
  },
  // webpack-dev-server 服务设置
  'dev': {
    // webpack-dev-server 服务端口号
    'port': 8080,
    // 浏览器自动开启的默认页
    'startPage': '/templates/index.ejs',
  },
  // 发布目录，如：/Content
  'publicPath': [
    'Content'
  ],
  // 不启用反向代理时，发布后的接口服务设置
  'publicApiHost': {
    'name': 'http://10.0.2.151',
    'port': '81'
  },
  // 是否启用重写 .html URL。启用后访问链接则不带 .html 扩展名。如：http://localhost:8080/Content/index
  // 如需无缝切换可以结合 JMSLink、JMSLinkHandler 组件使用。组件位于：src/utils/index.js
  'rewriteDotHtml': true,
};
