const path = require('path');

const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');

const entries = require('../include/entries');
const plugins = require('../include/plugins');
const { getTheme } = require('../include/themes');

const { mock, publicPath, publicApiHost, theme } = require('../../.projectrc');

const servicesRule = {
  'publicApiHost': {
    test: /request\.js$/,
    loader: "string-replace-loader",
    options: {
      multiple: [
        {
          search: 'http://localhost',
          replace: publicApiHost.name
        },
        {
          search: 'mock.port',
          replace: publicApiHost.port ? publicApiHost.port : 80
        }
      ]
    }
  }
};

const production = {
  mode: 'production',
  context: path.resolve(__dirname, '..', '..'),
  entry: entries,
  output: {
    path: path.resolve(__dirname, '..', '..', 'dist', ...publicPath),
    filename: '[name].bundle.js',
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
              'transform-decorators-legacy',
            ]
          }
        },
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ExtractTextWebpackPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                modules: false,
                url: true,
                minimize: true
              }
            },
            {
              loader: 'postcss-loader'
            }
          ]
        }),
        exclude: /assets/
      },
      {
        test: /\.less$/,
        use: ExtractTextWebpackPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                modules: true,
                url: true,
                minimize: true,
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
          ]
        }),
        include: /src/
      },
      {
        test: /\.less$/,
        use: ExtractTextWebpackPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                minimize: true
              }
            },
            {
              loader: 'postcss-loader'
            },
            {
              loader: 'less-loader',
              options: {
                modifyVars: getTheme(theme),
                javascriptEnabled: true,
              }
            },
          ]
        }),
        exclude: /src/
      },
      {
        test: /\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/,
        loader: 'url-loader',
        options: {
          limit: 8192,
          name: '[hash:8].[name].[ext]',
          outputPath: 'assets/images/',
          publicPath: `${publicPath.length ? `/${publicPath.join('/')}` : ''}/assets/images/`
        }
      }
    ]
  },
  externals: {
    'jQuery': 'window.jQuery',
    'React': 'window.React',
    'ReactDOM': 'window.ReactDOM',
    'react': 'window.React',
    'react-dom': 'window.ReactDOM',
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          chunks: 'initial',
          name: 'common',
          minChunks: 2,
          maxInitialRequests: 5,
          minSize: 0
        },
        vendor: {
          chunks: 'all',
          test: /node_modules/,
          name: 'vendor',
          priority: 1,
          enforce: true
        },
        'vendor~antd': {
          chunks: 'all',
          test: (module) => {
            return /antd|@ant-design/.test(module.context);
          },
          name: 'vendor~antd',
          priority: 2,
          enforce: true,
        },
        'vendor~moment': {
          chunks: 'all',
          test: (module) => {
            return /moment/.test(module.context);
          },
          name: 'vendor~moment',
          priority: 2,
          enforce: true,
        },
      }
    },
    runtimeChunk: {
      name: "runtime",
    }
  },
};

plugins.push(
  new CleanWebpackPlugin('./dist', {
    root: path.resolve(__dirname, '..', '..'),
    verbose: true,
    dry: false
  }),
  new ExtractTextWebpackPlugin({
    filename: '[name].bundle.css',
    allChunks: true
  }),
);

/** 设置plugins **/
production.plugins = plugins;

/** 设置loader **/
if (publicApiHost.name && !mock.ReverseProxy) {
  production.module.rules.push(servicesRule.publicApiHost);
}

/** 公用发布路径 **/
global.publicPath = publicPath.length ? `/${publicPath.join('/')}` : '';

module.exports = production;
