module.exports = {
  'theme': 'antd.default',
  'mock': {
    'ReverseProxy': false,
    'port': 3000,
    'proxyPath': '/api',
    'proxyTarget': 'http://10.0.2.231:3333/mock/XX'
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
