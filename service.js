const fs = require('fs');

const express = require('express'),
  timeout = require('connect-timeout'),
  app = express();

const API = {
  common: require('./api/common')
};

const PORT = '3000',
  TIME_OUT = 30 * 1e3;

app.set('port', PORT);

app.use(timeout(TIME_OUT));
app.use((req, res, next) => {
  if (!req.timedout) next();
});

// 获取所有年级
app.post('/api/common/getGrades', API.common.getGrades);
// 获取学科
app.post('/api/common/getCourses', API.common.getCourses);

app.listen(app.get('port'), () => {
  console.log(`server running @ ${app.get('port')} port`);
});

