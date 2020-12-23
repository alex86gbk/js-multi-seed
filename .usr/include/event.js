/* https://webpack.js.org/api/compiler-hooks/#root */
function WebpackEventPlugin(options) {
  let status = {
    once: '',
  };
  let defaultOptions = {
    onEmit: function () {},
    onDoneOnce: function () {},
  };
  this.getState = function getState() {
    return status;
  }
  this.doneOnce = function doneOnce() {
    status.once = 'done';
  }

  this.options = Object.assign(defaultOptions, options);
}

WebpackEventPlugin.prototype.apply = function(compiler) {
  const options = this.options;

  compiler.hooks.emit.tap("onEmit", params => {
    if (typeof options.onEmit === 'function') {
      options.onEmit();
    }
  });

  compiler.hooks.done.tap("onDoneOnce", stats => {
    if (typeof options.onDoneOnce === 'function' && this.getState().once === '') {
      options.onDoneOnce();
      this.doneOnce();
    }
  });
};

module.exports = WebpackEventPlugin;
