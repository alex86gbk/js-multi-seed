const path = require('path');
const Glob = require('glob').Glob;

const TransferWebpackPlugin = require('transfer-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const options = {
  cwd: path.resolve(__dirname, '../', 'templates'),
  sync: true,
};
const globInstance = new Glob('**/*.ejs', options);
const plugins = [
  new TransferWebpackPlugin([
    { from: "assets", to: "assets" }
  ], path.resolve(__dirname, "../", "src"))
];

globInstance.found.forEach((page) => {
  plugins.push(
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "../", "templates", page),
      filename: page.replace(/\.ejs$/, '') + ".html",
      chunks: [page.replace(/\.ejs$/, ''), "common", "vendor"],
    })
  );
});

module.exports = plugins;
