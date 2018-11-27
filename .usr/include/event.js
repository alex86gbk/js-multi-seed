function WebpackEventPlugin(options) {
  let defaultOptions = {
    onBuildStart: function () {},
    onBuildEnd: function () {}
  };

  this.options = Object.assign(defaultOptions, options);
}

WebpackEventPlugin.prototype.apply = function(compiler) {
  const options = this.options;

  compiler.plugin("compilation", compilation => {
    if(typeof options.onBuildStart === 'function'){
      options.onBuildStart();
    }
  });

  compiler.plugin("emit", (compilation, callback) => {
    if(typeof options.onBuildEnd === 'function'){
      options.onBuildEnd();
    }
    callback();
  });
};

module.exports = WebpackEventPlugin;
