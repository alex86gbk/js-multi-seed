const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const entries = require('../include/entries');
const plugins = require('../include/plugins');
const { registerPid } = require('../include/registerPid');

const { mock, dev, publicPath } = require('../../.projectrc');
const devServerPublicPath = publicPath.length ? `/${publicPath.join('/')}` : '';

/** 公用发布路径 **/
global.publicPath = devServerPublicPath;

/**
 * devServerRunAfter
 */
function devServerRunAfter() {
  const varPath = path.join(__dirname, '..', '..', '.var');
  registerPid(varPath, 'dev-server.pid', process.pid);

  if (process.env.API === 'local') {
    try {
      exec('node .usr/local/mock-server', (err) => {
        if (err) {
          console.error(`exec error: ${err}`);
        }
      });
    } catch (err) {
      console.log(`catch error: ${err}`);
    }
  }
}

/**
 * 构造代理对象
 * @constructor
 */
function Proxy() {
  let proxyTarget;
  const proxy = {};

  if (process.env.API === 'dev') {
    proxyTarget = mock.YAPI;
  } else {
    proxyTarget = `http://localhost:${mock.port}${mock.proxyPath}`;
  }

  proxy[mock.proxyPath] = {};
  proxy[mock.proxyPath]['target'] = proxyTarget;
  proxy[mock.proxyPath]['pathRewrite'] = {};
  proxy[mock.proxyPath]['pathRewrite'][`^${mock.proxyPath}`] = '';

  return proxy;
}

module.exports = {
  mode: 'development',
  context: path.resolve(__dirname, '..', '..'),
  devtool: 'source-map',
  entry: entries,
  output: {
    path: path.resolve(__dirname, '..', '..', 'public', ...publicPath),
    publicPath: `${devServerPublicPath}/`,
  },
  devServer: {
    contentBase: path.resolve(__dirname, '..', '..', 'public'),
    publicPath: `${devServerPublicPath}/`,
    proxy: new Proxy(),
    historyApiFallback: {
      rewrites:[
        { from:/./, to:`${devServerPublicPath}/404.html` }
      ]
    },
    host: '0.0.0.0',
    port: dev.port || 8080,
    inline: true,
    overlay: true,
    stats: "errors-only",
    after: devServerRunAfter,
  },
  module: {
    rules: [
      {
        test: /(\.jsx|\.js)$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                'env',
                {
                  'targets': {
                    'browsers': [
                      'ie > 8',
                      'last 2 versions'
                    ]
                  },
                  'useBuiltIns': true
                }
              ],
              'react',
              'stage-0'
            ],
            plugins: [
              'transform-runtime',
              [
                'import',
                {
                  'libraryName': 'antd',
                  'style': true
                }
              ],
              [
                'component',
                {
                  'libraryName': 'element-ui',
                  'styleLibraryName': 'theme-chalk'
                }
              ],
              'transform-decorators-legacy',
            ]
          }
        },
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              modules: false
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true
            }
          }
        ],
        exclude: /assets/
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: '[name]__[local]__[hash:base64:5]'
            }
          },
          {
            loader: 'postcss-loader'
          },
          {
            loader: 'less-loader',
            options: {
              javascriptEnabled: true,
            }
          },
        ],
        include: /src/
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'postcss-loader'
          },
          {
            loader: 'less-loader',
            options: {
              javascriptEnabled: true,
            }
          },
        ],
        exclude: /src/
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
      },
    ]
  },
  plugins: plugins,
  externals: {
    'jQuery': 'window.jQuery',
    'React': 'window.React',
    'ReactDOM': 'window.ReactDOM',
    'react': 'window.React',
    'react-dom': 'window.ReactDOM',
    'vue': 'window.Vue'
  },
};
