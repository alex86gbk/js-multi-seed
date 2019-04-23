const fs = require('fs');
const path = require('path');
const exitHook = require('exit-hook');

/**
 * 注册进程
 * @param {String} varPath
 * @param {String} pidFile
 * @param {Number} pid
 */
function registerPid(varPath, pidFile, pid) {
  const existVarPath = fs.existsSync(varPath);
  const existPidFile = fs.existsSync(path.resolve(varPath, pidFile));

  if (!existVarPath) {
    fs.mkdirSync(varPath);
  }

  if (existPidFile) {
    fs.unlinkSync(path.resolve(varPath, pidFile));
  }

  fs.writeFileSync(path.resolve(varPath, pidFile), pid);

  exitHook(() => {
    let stats = fs.statSync(path.resolve(varPath, pidFile));

    if (stats.isFile()) {
      fs.unlinkSync(path.resolve(varPath, pidFile));
    }
  });
}

module.exports = {
  registerPid,
};
