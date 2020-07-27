/* default */
const os = require('os');
const path = require('path');
const Glob = require('glob').Glob;

const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin-to-multihtml');
const HappyPack = require('happypack');
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
  )
];

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
      filename: page.replace(/\.ejs$/, '') + ".html",
      chunks: ["manifest", "vendor", "vendor~antd", "vendor~moment", "common", page.replace(/\.ejs$/, '')],
      chunksSortMode: 'manual',
      multihtmlCache: true,
    })
  );
});

/* happypack */
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });
const createHappyPlugin = (id, loaders) => new HappyPack({
  id: id,
  loaders: loaders,
  threadPool: happyThreadPool,
  verbose: process.env.HAPPY_VERBOSE === '1'
});
plugins.push(createHappyPlugin('happypack-babel-loader',
  [{
    loader: 'babel-loader',
    options: {
      cacheDirectory: true,
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
    },
  }]
));

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
