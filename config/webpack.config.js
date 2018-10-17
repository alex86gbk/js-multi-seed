const path = require('path');
const webpack = require('webpack');

const entries = require('./entries');
const plugins = require('./plugins');

const { exec } = require('child_process');
const { mock, publicPath } = require('../.projectrc');
const devServerPublicPath = publicPath.length ? `/${publicPath.join('/')}` : '';

/** 公用发布路径 **/
global.publicPath = devServerPublicPath;

/**
 * devServerRunAfter
 */
function devServerRunAfter() {
  if (process.env.API === 'local') {
    exec('node mock/service', (err) => {
      if (err) {
        console.error(`exec error: ${err}`);
      }
    });
  }
}

/**
 * 构造代理对象
 * @constructor
 */
function Proxy() {
  let proxyTarget;
  const proxy = {};

  if (process.env.API === 'local') {
    proxyTarget = `http://localhost:${mock.port}${mock.proxyPath}`;
  } else {
    proxyTarget = mock.YAPI;
  }

  proxy[mock.proxyPath] = {};
  proxy[mock.proxyPath]['target'] = proxyTarget;
  proxy[mock.proxyPath]['pathRewrite'] = {};
  proxy[mock.proxyPath]['pathRewrite'][`^${mock.proxyPath}`] = '';

  return proxy;
}

module.exports = {
  mode: 'development',
  context: path.resolve(__dirname, '..'),
  devtool: 'source-map',
  entry: entries,
  output: {
    path: path.resolve(__dirname, '..', 'public', ...publicPath),
  },
  devServer: {
    contentBase: path.resolve(__dirname, '..', 'public'),
    publicPath: devServerPublicPath,
    proxy: new Proxy(),
    historyApiFallback: true,
    host: '0.0.0.0',
    inline: true,
    after: devServerRunAfter
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
                  'libraryDirectory': 'es',
                  'style': 'css'
                }
              ],
              [
                'component',
                {
                  'libraryName': 'element-ui',
                  'styleLibraryName': 'theme-chalk'
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
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              modules: false
            }
          },
          {
            loader: 'postcss-loader'
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
              modules: true
            }
          },
          {
            loader: 'postcss-loader'
          },
          {
            loader: 'less-loader'
          },
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
