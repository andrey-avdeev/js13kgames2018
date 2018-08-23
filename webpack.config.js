const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const isProduction = process.env.npm_lifecycle_event === 'build'

const definePlugin = new webpack.DefinePlugin({
  __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'true'))
})

let htmlConfig = {
  filename: 'index.html',
  template: './index.html',
  inject: 'body',
  inlineSource: isProduction && '\.(js|css)$',
  minify: {
    removeAttributeQuotes: isProduction,
    collapseWhitespace: isProduction,
    html5: isProduction,
    minifyCSS: isProduction,
    minifyJS: isProduction,
    minifyURLs: isProduction,
    removeComments: isProduction,
    removeEmptyAttributes: isProduction
  },
  hash: false
};

let config = {
  entry: {
    app: [
      path.resolve(__dirname, './src/index.ts')
    ]
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        uglifyOptions: {
          compress: true,
          ecma: 5,
          mangle: true,
          output: {
            comments: false,
            beautify: false
          },
        },
        sourceMap: true,
        extractComments:true
      })
    ]
  },
  // mode: 'production',
  output: {
    pathinfo: true,
    filename: '[name].bundle.js',
    path: path.resolve('./dist'),
    publicPath: '/',
    devtoolModuleFilenameTemplate: '[absolute-resource-path]'
  },
  devServer: {
    hot: false,
    compress: true,
    disableHostCheck: true,
  },
  plugins: [
    definePlugin,
    new MiniCssExtractPlugin({
      filename: "style.css",
    }),
    new webpack.ProvidePlugin({
      'window.kontra':'exports-loader?kontra!kontra/kontra.js'
    }),
    new CopyWebpackPlugin([{
      from: './src/assets',
      to: './assets'
    }]),
    new HtmlWebpackPlugin(htmlConfig),
    new HtmlWebpackInlineSourcePlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: '/node_modules/'
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../'
            }
          },
          "css-loader"
        ]
      }
    ]
  },
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  },
  resolve: {
    extensions: ['.ts', '.js']
  }
}
if (!isProduction) {
  config.devtool = 'eval-source-map'
} else {
  // config.plugins = config.plugins.concat([
  //   new webpack.optimize.ModuleConcatenationPlugin()
  // ])
}

module.exports = config