/* default */
const path = require('path');
const Glob = require('glob').Glob;

const TransferWebpackPlugin = require('transfer-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const options = {
  cwd: path.resolve(__dirname, '..', '..', 'templates'),
  sync: true,
};
const globInstance = new Glob('**/*.ejs', options);
const plugins = [
  new TransferWebpackPlugin([
    { from: "src/assets", to: "assets" },
  ], path.resolve(__dirname, "..", '..'))
];

globInstance.found.forEach((page) => {
  plugins.push(
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "..", "..", "templates", page),
      filename: page.replace(/\.ejs$/, '') + ".html",
      chunks: ["runtime", "vendor", "vendor~antd", "vendor~moment", "common", page.replace(/\.ejs$/, '')],
      chunksSortMode: 'manual',
    })
  );
});

/* event */
const opn = require('opn');
const WebpackEventPlugin = require('./event');

let isStartPageOpened = false;
const { dev, publicPath } = require('../../.projectrc');
const devServerPublicPath = publicPath.length ? `/${publicPath.join('/')}` : '';
const devServerStartPage = `${devServerPublicPath}${dev.startPage.replace(/^\/templates/, '').replace(/\.ejs/, '.html')}`;

plugins.push(new WebpackEventPlugin({
  onBuildEnd: function () {
    if (!isStartPageOpened && process.env.API) {
      isStartPageOpened = true;
      opn(`http://localhost:${dev.port}${devServerStartPage}`);
    }
  }
}));

module.exports = plugins;
