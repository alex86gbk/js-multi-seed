const fs = require('fs');
const path = require('path');
const exitHook = require('exit-hook');

/**
 * 注册进程
 * @param {String} filePath
 * @param {String} pidFile
 * @param {Number} pid
 */
function registerPid(filePath, pidFile, pid) {
  const varPath = filePath;
  const existVarPath = fs.existsSync(varPath);

  if (!existVarPath) {
    fs.mkdirSync(varPath);
  }

  fs.writeFileSync(path.resolve(filePath, pidFile), pid);

  exitHook(() => {
    let stats = fs.statSync(path.resolve(filePath, pidFile));

    if (stats.isFile()) {
      fs.unlinkSync(path.resolve(filePath, pidFile));
    }
  });
}

module.exports = {
  registerPid,
};
