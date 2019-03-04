const path = require('path');

const config = require('./site.config');
const loaders = require('./webpack.loaders');
const plugins = require('./webpack.plugins');

module.exports = () => ({
  externals: {
    echarts: 'echarts',
    moment: 'moment',
  },
  context: path.join(config.root, config.paths.src),
  entry: path.join(config.root, config.paths.src, 'javascripts/Actimetry'),
  output: {
    library: 'Actimetry',
    libraryExport: 'default',
    libraryTarget: 'umd',
    path: path.join(config.root, config.paths.dist),
    filename: 'actimetry.js',
    // filename: '[name].[hash].js',
  },
  mode: ['production', 'development'].includes(config.env)
    ? config.env
    : 'development',
  devtool: 'cheap-eval-source-map',
  devServer: {
    contentBase: path.join(config.root, config.paths.src),
    watchContentBase: true,
    hot: true,
    open: true,
    port: config.port,
    host: config.dev_host,
  },
  module: {
    rules: loaders,
  },
  plugins,
});