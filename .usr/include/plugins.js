/* default */
const os = require('os');
const path = require('path');
const Glob = require('glob').Glob;

const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackInjector = require('html-webpack-injector');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const opn = require('opn');
const WebpackEventPlugin = require('./event');

const plugins = [
  new ProgressBarPlugin(),
  new CopyPlugin(
    [
      { from: "src/assets", to: "assets" },
      { from: "public", to: "" },
    ],
    {
      context: path.resolve(__dirname, "..", '..')
    }
  ),
  new HtmlWebpackInjector()
];

if (process.env.NODE_ENV === 'production') {
  plugins.push(
    new HardSourceWebpackPlugin({
      cachePrune: {
        sizeThreshold: 200 * 1024 * 1024
      },
    }),
  )
}

/* HtmlWebpackPlugin */
const { title } = require('../../.projectrc');
const options = {
  cwd: path.resolve(__dirname, '..', '..', 'templates'),
  sync: true,
};
const globInstance = new Glob('**/*.ejs', options);
globInstance.found.forEach((page) => {
  plugins.push(
    new HtmlWebpackPlugin({
      title: title,
      template: path.resolve(__dirname, "..", "..", "templates", page),
      filename: page.replace(/\.ejs$/, '.html'),
      chunks: ["manifest", "vendor", "vendor~antd", "vendor~moment", "common", page.replace(/\.ejs$/, '')],
      chunksSortMode: 'manual',
      cache: true,
    })
  );
});

/* opn */
let isStartPageOpened = false;
const { dev, publicPath } = require('../../.projectrc');
const devServerPublicPath = publicPath.length ? `/${publicPath.join('/')}` : '';
const devServerStartPage = `${devServerPublicPath}${dev.startPage.replace(/^\/templates/, '').replace(/\.ejs/, '.html')}`;

plugins.push(new WebpackEventPlugin({
  onBuildEnd: function () {
    if (!isStartPageOpened && process.env.API) {
      isStartPageOpened = true;
      opn(`http://localhost:${dev.port}${devServerStartPage}`);
      setTimeout(function () {
        console.log(`\r\nThe project is running at: http://localhost:${dev.port}`);
      }, 100);
    }
  }
}));

module.exports = plugins;
