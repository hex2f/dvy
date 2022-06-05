const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { ESBuildMinifyPlugin } = require('esbuild-loader')
const CopyPlugin = require('copy-webpack-plugin')

const prod = process.env.NODE_ENV === 'production'

module.exports = {
  mode: prod ? 'production' : 'development',
  devServer: {
    compress: true,
    port: 3001,
    historyApiFallback: true,
    hot: true
  },
  entry: {
    app: path.join(__dirname, 'src', 'react', 'index.tsx')
  },
  target: 'electron-renderer',
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    alias: {
      '~': path.resolve(__dirname, 'src')
    }
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: '/node_modules/'
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          { loader: 'css-loader', options: { url: false } },
          'postcss-loader'
        ]
      }
    ]
  },
  optimization: {
    minimize: prod,
    minimizer: [
      new ESBuildMinifyPlugin({
        css: true
      })
    ]
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'out/react'),
    chunkFilename: '[name].[chunkhash:3].js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'react', 'index.html'),
      publicPath: '/'
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
      chunkFilename: 'styles.css'
    }),
    new CopyPlugin({
      patterns: [
        { from: 'src/react/public', to: '.' }
      ]
    })
  ]
}
