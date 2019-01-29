module.exports = {
  "reverseProxy": true,
  "mock": {
    "port": 3000,
    "proxyPath": "/api",
    "YAPI": "http://10.0.2.231:3333/mock/XX"
  },
  "dev": {
    "port": 8080
  },
  "publicPath": [
    "Content"
  ],
  "startPage": "/templates/guide.ejs"
};
