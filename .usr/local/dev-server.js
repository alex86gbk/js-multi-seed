const os = require('os');
const path = require('path');
const { exec } = require('child_process');

const entries = require('../include/entries');
const plugins = require('../include/plugins');
const { getTheme } = require('../include/themes');
const { registerPid } = require('../include/registerPid');

const { mock, dev, publicPath, theme, rewriteDotHtml } = require('../../.projectrc');
const devServerPublicPath = publicPath.length ? `/${publicPath.join('/')}` : '';

const servicesRule = {
  'proxyUrl': {
    test: /request\.js$/,
    loader: "string-replace-loader",
    options: {
      multiple: [
        {
          search: 'mock.ReverseProxy',
          replace: 'true'
        }
      ]
    }
  }
};

const totalMemory = dealMem(os.totalmem());
const freeMemory = dealMem(os.freemem());

/** 公用发布路径 **/
global.publicPath = devServerPublicPath;
global.proxyPath = process.env.API ? mock.proxyPath : '';

/**
 * 启动mock服务
 */
function runMockServer() {
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

function dealMem(mem) {
  let G = 0;
  let M = 0;
  let KB = 0;
  (mem > (1 << 30)) && (G = (mem / (1 << 30)).toFixed(2));
  (mem > (1 << 20)) && (mem < (1 << 30)) && (M = (mem / (1 << 20)).toFixed(2));
  (mem > (1 << 10)) && (mem > (1 << 20)) && (KB = (mem / (1 << 10)).toFixed(2));
  return G > 0 ? G + 'G' : M > 0 ? M + 'M' : KB > 0 ? KB + 'KB' : mem + 'B';
}

/**
 * 构造代理对象
 * @constructor
 */
function Proxy() {
  let proxyTarget;
  const proxy = {};

  if (process.env.API === 'dev') {
    proxyTarget = mock.proxyTarget;
  } else {
    if (mock.ReverseProxy) {
      proxyTarget = `http://localhost:${mock.port}${mock.proxyPath}`;
    } else {
      proxyTarget = `http://localhost:${mock.port}`;
    }
  }

  proxy[mock.proxyPath] = {};
  proxy[mock.proxyPath]['target'] = proxyTarget;
  proxy[mock.proxyPath]['changeOrigin'] = true;
  proxy[mock.proxyPath]['pathRewrite'] = {};
  proxy[mock.proxyPath]['pathRewrite'][`^${mock.proxyPath}`] = '';

  return proxy;
}

/**
 * 构造URL改写规则
 * @constructor
 */
function RewriteRules() {
  const rewriteDotHtmlReg = new RegExp(`^${devServerPublicPath}/.*$`);
  const rewriteRules = [
    { from: /./, to: `${devServerPublicPath}/404.html` }
  ];
  if (rewriteDotHtml) {
    rewriteRules.unshift(
      {
        from: rewriteDotHtmlReg, to: function (context) {
          return `${context.parsedUrl.pathname}.html`;
        }
      }
    )
  }

  return rewriteRules;
}

const developer = {
  mode: 'development',
  context: path.resolve(__dirname, '..', '..'),
  devtool: totalMemory.match(/G$/) && freeMemory.match(/G$/)
    ? parseInt(totalMemory) >= 6 && parseInt(freeMemory) >= 3
      ? 'cheap-module-eval-source-map'
      : 'source-map'
    : 'source-map',
  entry: entries,
  output: {
    path: path.resolve(__dirname, '..', '..', 'public', ...publicPath),
    publicPath: `${devServerPublicPath}/`,
  },
  resolve: {
    extensions: [
      '.js',
      '.jsx',
      '.ts',
      '.tsx',
    ],
  },
  devServer: {
    contentBase: path.resolve(__dirname, '..', '..', 'public'),
    publicPath: `${devServerPublicPath}/`,
    proxy: new Proxy(),
    historyApiFallback: {
      rewrites: new RewriteRules(),
    },
    host: '0.0.0.0',
    disableHostCheck: true,
    port: dev.port || 8080,
    inline: true,
    overlay: true,
    stats: 'errors-only',
    noInfo: true,
    after: runMockServer,
  },
  watch: true,
  watchOptions: {
    ignored: ['node_modules', 'assets/vendor/**/*.js'],
    aggregateTimeout: 1000,
    poll: 1000,
  },
  cache: {
    type: 'memory'
  },
  module: {
    rules: [
      {
        test: /(\.jsx|\.js|\.tsx|\.ts)$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-react',
              '@babel/preset-typescript'
            ],
            plugins: [
              ['import', { libraryName: 'antd', style: true }],
              ["@babel/plugin-proposal-class-properties", { "loose": true }],
              ['@babel/plugin-transform-runtime']
            ],
          }
        },
        include: [path.resolve(__dirname, '..', '..', 'src')],
        exclude: /node_modules|assets/
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
              modules: {
                localIdentName: '[name]__[local]__[hash:base64:5]'
              },
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
              modifyVars: getTheme(theme),
              javascriptEnabled: true,
            }
          },
        ],
        exclude: /src/
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
    'react-dom': 'window.ReactDOM'
  },
};

if (process.env.API === 'dev') {
  developer.module.rules.push(servicesRule.proxyUrl);
}

module.exports = developer;
