module.exports = {
  'theme': 'antd.localhost',
  'mock': {
    'ReverseProxy': true,
    'port': 3000,
    'proxyPath': '/api',
    'YAPI': 'http://10.0.2.231:3333/mock/XX'
  },
  'dev': {
    'port': 8080,
    'startPage': '/templates/guide.ejs',
  },
  'publicPath': [
    'Content'
  ],
  'publicApiHost': {
    'name': 'http://10.0.2.151',
    'port': '81'
  },
};
