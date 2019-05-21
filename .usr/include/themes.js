const path = require('path');
const glob = require('glob');

const cwd = path.resolve(__dirname, '..', '..', 'themes');
const globInstance = new glob.sync('**/*.js', {
  cwd: cwd,
});

/**
 * 获取主题
 * @param {String} theme
 * @return {Object}
 */
function getTheme(theme) {
  if (globInstance.indexOf(`${theme}.js`) > -1) {
    return require(path.resolve(cwd, theme));
  } else {
    return {};
  }
}

module.exports = {
  getTheme,
};
