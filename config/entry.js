const path = require('path');
const Glob = require('glob').Glob;

const options = {
  cwd: path.resolve(__dirname, '../', 'src/pages'),
  sync: true,
};
const globInstance = new Glob('**/*.js', options);
const entry = {};

globInstance.found.forEach((page) => {
  entry[page.replace(/\.js$/, '')] = './src/pages/' + page;
});

module.exports = entry;
