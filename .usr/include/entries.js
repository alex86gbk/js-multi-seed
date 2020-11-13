const path = require('path');
const Glob = require('glob').Glob;

const options = {
  cwd: path.resolve(__dirname, '..', '..', 'src/pages'),
  sync: true,
};
const globInstance = new Glob('**/*+(.js|.ts|.tsx)', options);
const entries = {};

globInstance.found.forEach((page) => {
  entries[page.replace(/(\.js|\.ts|\.tsx)$/, '')] = './src/pages/' + page;
});

module.exports = entries;
