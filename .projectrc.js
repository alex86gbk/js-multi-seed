module.exports = {
  'theme': 'antd.default',
  'mock': {
    'ReverseProxy': true,
    'port': 3000,
    'proxyPath': '/api',
    'proxyTarget': 'http://localhost:3001/'
  },
  'dev': {
    'port': 8080,
    'startPage': '/templates/index.ejs',
  },
  'publicPath': [
    'Content'
  ],
  'publicApiHost': {
    'name': 'http://10.0.2.151',
    'port': '81'
  },
  'rewriteDotHtml': true,
};
