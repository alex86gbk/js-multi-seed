const path = require("path");
const webpack = require("webpack");

const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');

const entry = require('./config/entry');
const plugins = require('./config/plugins');

plugins.push(
  new CleanWebpackPlugin("dist/*.*", {
    root: __dirname,
    verbose: true,
    dry: false
  }),
  new ExtractTextWebpackPlugin("[name].bundle.css"),
);

module.exports = {
  mode: "production",
  entry: entry,
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          chunks: "initial",
          name: "common",
          minChunks: 2,
          maxInitialRequests: 5,
          minSize: 0
        },
        vendor: {
          chunks: "all",
          test: /node_modules/,
          name: "vendor",
          priority: 10,
          enforce: true
        },
      }
    }
  },
  output: {
    path: __dirname + "/dist",
    filename: "[name].bundle.js",
  },
  module: {
    rules: [
      {
        test: /(\.jsx|\.js)$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              ["env", {
                "targets": {
                  "browsers": [
                    "ie > 8",
                    "last 2 versions"
                  ]
                },
                "useBuiltIns": true
              }], "react", "stage-0"],
            plugins: ["transform-runtime"]
          }
        },
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ExtractTextWebpackPlugin.extract({
          fallback: "style-loader",
          use: [
            {
              loader: "css-loader",
              options: {
                modules: true,
                url: false,
                minimize: true
              }
            },
            {
              loader: "postcss-loader"
            }
          ]
        }),
        exclude: /assets/
      },
      {
        test: /\.less$/,
        use: ExtractTextWebpackPlugin.extract({
          fallback: "style-loader",
          use: [
            {
              loader: "css-loader",
              options: {
                modules: true,
                url: false,
                minimize: true
              }
            },
            {
              loader: "less-loader"
            },
            {
              loader: "postcss-loader"
            }
          ]
        }),
        exclude: /assets/
      },
      {
        test: /\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/,
        loader: 'url-loader?limit=8192&name=assets/images/[hash:8].[name].[ext]'
      }
    ]
  },
  plugins: plugins,
  externals: {
    "jQuery": "window.jQuery",
    "React": "window.React",
    "ReactDOM": "window.ReactDOM"
  },
};
