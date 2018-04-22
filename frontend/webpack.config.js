var path = require('path')
var webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const autoprefixer = require('autoprefixer')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
  devtool: 'eval-source-map', // DELETE ME WHEN FOR THE PRODUCTION!
  entry: [
    './src/index'
  ],
  output: {
    path: path.join(__dirname, 'dist/static'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'ptsy.dict',
      filename: path.join(__dirname, '/dist/index.html'),
      template: path.join(__dirname, '/index.html'),
      chunks: ['main']
    }),
    new ExtractTextPlugin('styles.css'),
    new webpack.HotModuleReplacementPlugin(),
    new UglifyJsPlugin()
  ],
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [{
      test: /\.jsx?$/,
      use: ['babel-loader'],
      include: path.join(__dirname, 'src')
    },
    {
      test: /\.(scss|sass|css)$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: [{
          loader: 'css-loader'
        }, {
          loader: 'postcss-loader',
          options: {
            sourceMap: true,
            plugins: () => [autoprefixer({ browsers: ['iOS >= 7', 'Android >= 4.1'] })]
          }
        }, {
          loader: 'sass-loader',
          query: {
            sourceMap: true
          }
        }]
      })
    }]
  },
  devServer: {
    historyApiFallback: true,
    hot: true,
    inline: true,
    progress: true,
    proxy: {
      '/v1/*': {
        target: 'http://localhost:8877',
        changeOrigin: true,
        secure: false
      }
    }
  }
}
