const fs = require('fs');
const exitHook = require('exit-hook');

/**
 * 注册进程
 * @param {String} pidFile
 * @param {Number} pid
 */
function registerPid(pidFile, pid) {
  fs.writeFileSync(pidFile, pid);

  exitHook(() => {
    let stats = fs.statSync(pidFile);

    if (stats.isFile()) {
      fs.unlinkSync(pidFile);
    }
  });
}

module.exports = {
  registerPid,
};
