const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const WebpackManifestPlugin = require('webpack-manifest-plugin')

const env = process.env.NODE_ENV
const outputDir = process.env.OUT_DIR || 'demo'

function resolvePath(...args) {
  return path.resolve(__dirname, ...args)
}

const webpackConfig = {
  context: __dirname,
  entry: {
    index: resolvePath('./src/main.js'),
  },
  devtool: 'inline-source-map',
  output: {
    path: resolvePath('.', `dist/${outputDir}`),
    filename: '[name].js',
    publicPath: env === 'dev' ? '/' : './',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: resolvePath('index.html'),
    }),
  ],
}

module.exports = env === 'dev'
  ? {
    ...webpackConfig,
    mode: 'development',
    devServer: {
      port: 8080,
      contentBase: resolvePath('dist'),
      // compress: true,
      hot: true,
    },
  }
  : {
    ...webpackConfig,
    // 默认生产会压缩代码
    mode: 'development',
    plugins: [
      ...webpackConfig.plugins,
      new WebpackManifestPlugin({}),
    ],
  }
