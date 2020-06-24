const fs = require('fs');
const path = require('path');

const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
const cssnano = require('cssnano');

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
          loader: 'happypack/loader?id=happypack-babel-loader',
        },
        include: [path.resolve(__dirname, '..', '..', 'src')],
        exclude: /node_modules|assets/
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
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins: [
                  cssnano({
                    preset: 'default',
                  })
                ],
              },
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
                modules: {
                  localIdentName: '[name]__[local]__[hash:base64:5]'
                },
                url: true,
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
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins: [
                  cssnano({
                    preset: 'default',
                  })
                ],
              },
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
      name: "manifest",
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
  function () {
    this.hooks.done.tap('done', (stats) => {
      if (stats.compilation.errors && stats.compilation.errors.length && process.argv.indexOf('--watch') == -1) {
        console.log(stats.compilation.errors);
        const publicPath = path.resolve(__dirname, '..', '..', 'dist');
        if (!fs.existsSync(publicPath)) {
          fs.mkdirSync(publicPath);
        }
        fs.writeFileSync(path.resolve(publicPath, 'error.txt'), stats.compilation.errors, 'utf8');
        process.exit(1);
      }
    })
  }
);

/** 设置plugins **/
production.plugins = plugins;

/** 设置loader **/
if (publicApiHost.name && !mock.ReverseProxy) {
  production.module.rules.push(servicesRule.publicApiHost);
}

/** 公用发布路径 **/
global.publicPath = publicPath.length ? `/${publicPath.join('/')}` : '';
global.proxyPath = mock.proxyPath;

module.exports = production;
