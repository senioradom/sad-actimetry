const webpack = require('webpack');
const cssnano = require('cssnano');
const glob = require('glob');
const path = require('path');

const WebpackBar = require('webpackbar');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const config = require('./site.config');

const tplVars = new webpack.DefinePlugin({
  sad: {
    api: {
      contract: JSON.stringify(config.api.contract),
      actimetry: JSON.stringify(config.api.actimetry),
    },
  },
});

// Hot module replacement
const hmr = new webpack.HotModuleReplacementPlugin();

// Optimize CSS assets
const optimizeCss = new OptimizeCssAssetsPlugin({
  assetNameRegExp: /\.css$/g,
  cssProcessor: cssnano,
  cssProcessorPluginOptions: {
    preset: [
      'default',
      {
        discardComments: {
          removeAll: true,
        },
      },
    ],
  },
  canPrint: true,
});

// Clean webpack
const clean = new CleanWebpackPlugin(['dist'], {
  root: config.root,
});

// Stylelint
const stylelint = new StyleLintPlugin();

// Extract CSS
const cssExtract = new MiniCssExtractPlugin({
  // filename: 'style.[contenthash].css',
  filename: 'actimetry.css',
});

// HTML generation
const paths = [];
const generateHTMLPlugins = () => glob.sync('./src/**/*.html')
  .map((dir) => {
    const filename = path.basename(dir);

    paths.push(filename);

    return new HTMLWebpackPlugin({
      filename,
      template: path.join(config.root, config.paths.src, filename),
      meta: {
        viewport: config.viewport,
      },
    });
  });

// Webpack bar
const webpackBar = new WebpackBar({
  color: '#ff6469',
});

module.exports = [
  clean,
  stylelint,
  cssExtract,
  ...generateHTMLPlugins(),
  config.env === 'production' && optimizeCss,
  webpackBar,
  config.env === 'development' && hmr,
  tplVars,
].filter(Boolean);
