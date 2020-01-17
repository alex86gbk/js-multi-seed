/* https://webpack.js.org/api/compiler-hooks/#root */
function WebpackEventPlugin(options) {
  let defaultOptions = {
    onBuildStart: function () {},
    onBuildEnd: function () {}
  };

  this.options = Object.assign(defaultOptions, options);
}

WebpackEventPlugin.prototype.apply = function(compiler) {
  const options = this.options;

  compiler.hooks.compilation.tap("onBuildStart", compilation => {
    if(typeof options.onBuildStart === 'function'){
      options.onBuildStart();
    }
  });

  compiler.hooks.emit.tap("onBuildEnd", params => {
    if(typeof options.onBuildEnd === 'function'){
      options.onBuildEnd();
    }
  });
};

module.exports = WebpackEventPlugin;
