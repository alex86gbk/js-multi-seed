const path = require('path');

const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');

const entries = require('../include/entries');
const plugins = require('../include/plugins');

const { mock, publicPath, publicApiHost } = require('../../.projectrc');

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
    'vue': 'window.Vue'
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
          priority: 10,
          enforce: true
        },
      }
    }
  },
};

plugins.push(
  new CleanWebpackPlugin('./dist', {
    root: path.resolve(__dirname, '..', '..'),
    verbose: true,
    dry: false
  }),
  new ExtractTextWebpackPlugin('[name].bundle.css'),
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
