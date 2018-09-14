const path = require("path");
const webpack = require("webpack");

const entry = require('./config/entry');
const plugins = require('./config/plugins');

const { exec } = require("child_process");
const devServerProxy = process.env.API === "local" ?
  {
    "/api": {
      target: "http://localhost:3000/api",
      pathRewrite: {'^/api' : ''}
    }
  } :
  {
    "/api": {
      target: "http://10.0.2.231:3333/mock/XX",
      pathRewrite: {'^/api' : ''}
    }
  };
const devServerRunAfter = process.env.API === "local" ?
  function () {
    exec('node service', (err) => {
      if (err) {
        console.error(`exec error: ${err}`);
      }
    });
  }
  :
  function () {};

module.exports = {
  mode: "development",
  devtool: "source-map",
  entry: entry,
  output: {
    path: __dirname + "/public"
  },
  devServer: {
    contentBase: __dirname + "/public",
    proxy: devServerProxy,
    historyApiFallback: true,
    host: "0.0.0.0",
    inline: true,
    after: devServerRunAfter
  },
  module: {
    rules: [
      {
        test: /(\.jsx|\.js)$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              [
                "env",
                {
                  "targets": {
                    "browsers": [
                      "ie > 8",
                      "last 2 versions"
                    ]
                  },
                  "useBuiltIns": true
                }
              ],
              "react",
              "stage-0"
            ],
            plugins: [
              "transform-runtime",
              [
                "import",
                {
                  "libraryName": "antd",
                  "libraryDirectory": "es",
                  "style": "css"
                }
              ],
              [
                "component",
                {
                  "libraryName": "element-ui",
                  "styleLibraryName": "theme-chalk"
                }
              ]
            ]
          }
        },
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader",
            options: {
              modules: false
            }
          },
          {
            loader: "postcss-loader"
          }
        ],
        exclude: /assets/
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader",
            options: {
              modules: true
            }
          },
          {
            loader: "less-loader"
          },
          {
            loader: "postcss-loader"
          }
        ],
        exclude: /assets/
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            css: 'vue-style-loader!css-loader',
            less: 'vue-style-loader!css-loader!less-loader'
          },
          postLoaders: {
            html: 'babel-loader'
          }
        }
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
    "ReactDOM": "window.ReactDOM",
    "react": "window.React",
    "react-dom": "window.ReactDOM",
    "vue": "window.Vue"
  },
};
