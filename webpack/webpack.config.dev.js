'use strict';

require('dotenv').config();

const webpack = require('webpack');
const path = require('path');
const AssetsPlugin = require('assets-webpack-plugin');

const ExtractTextPlugin = require('extract-text-webpack-plugin');

const DashboardPlugin = require('./dashboard');

// const HtmlWebpackPlugin = require('html-webpack-plugin');

const PORT = process.env.PORT || 5000;

const PUBLIC_PATH = `http://localhost:8080/assets/`;

const mountPath = process.env.PARSE_MOUNT || '/parse';

const SERVER_URL = process.env.SERVER_URL || `http://localhost:${PORT}${mountPath}`;

// Serve the Relay app
module.exports = {
  devServer: {
    contentBase: false,
    publicPath: PUBLIC_PATH,

    // Configure hot replacement
    hot: true,

    // Set this as true if you want to access dev server from arbitrary url.
    // This is handy if you are using a html5 router.
    historyApiFallback: true,

    // The rest is terminal configurations
    quiet: true,
    noInfo: false,
    stats: {colors: true},
  },
  debug: true,
  devtool: '#source-map',
  entry: {
    main: [
      // For hot style updates
      'webpack/hot/dev-server',

      // The script refreshing the browser on none hot updates
      `webpack-dev-server/client?http://localhost:8080`,

      path.resolve(process.cwd(), 'js', 'app.js'),
    ],
  },
  module: {
    loaders: [
      {
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          cacheDirectory: true,
          presets: [
            'react-native'
          ],
          plugins: [
            'transform-runtime',
            'transform-export-extensions',
          ],
        },
        test: /\.js$/,
      },

      {test: /\.css$/, loader: 'style-loader!css-loader'},
      {test: /\.less$/, loader: 'style-loader!css-loader!less-loader'},

      {test: /\.gif$/, loader: 'url-loader', query: {mimetype: 'image/png'},},
      {test: /\.woff(2)?(\?v=[0-9].[0-9].[0-9])?$/, loader: 'url-loader', query: {mimetype: 'application/font-woff'},},

      {test: /\.svg$/, loader: 'url-loader', query: {}},

      {test: /\.(ttf|eot|svg)(\?v=[0-9].[0-9].[0-9])?$/, loader: 'file-loader', query: {name: '[name].[ext]'},},

      {test: /\.(png)$/, loader: 'url-loader', query: {limit: 100000},},

      {test: /\.jpg$/, loader: 'file-loader'},

      {
        // exclude: /node_modules/,
        test: /\.json/,
        loader: 'json',
      },

      {
        exclude: /node_modules/,
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('style', 'css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!sass'),
      },

    ]
  },
  node: {
    fs: 'empty'
  },
  postcss: function (webpack) {
    return [
      // require('postcss-import')({addDependencyTo: webpack}),
      // require('postcss-url')(),
      // require('postcss-cssnext')(),
      // // add your 'plugins' here
      // // ...
      // // and if you want to compress,
      // // just use css-loader option that already use cssnano under the hood
      // require('postcss-browser-reporter')(),
      // require('postcss-reporter')(),
    ]
  },
  output: {
    filename: '[hash:8].[name].js',
    path: '/',
    publicPath: PUBLIC_PATH,
    chunkFilename: '[id].[chunkhash:8].[name].js',
  },
  plugins: [
    // new HtmlWebpackPlugin({
    //   title: 'App',
    //   filename: path.resolve(process.cwd(), 'public', 'index.html'),
    //   template: path.resolve(process.cwd(), 'public', 'index.template.html'),
    // }),

    new DashboardPlugin(),

    new ExtractTextPlugin('[hash:8].app.css', {
      disable: false,
      allChunks: true
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        APPLICATION_ID: JSON.stringify(process.env.APPLICATION_ID),
        JAVASCRIPT_KEY: JSON.stringify(process.env.JAVASCRIPT_KEY),
        MASTER_KEY: JSON.stringify(process.env.MASTER_KEY),
        GA_TRACKING_CODE: JSON.stringify('UA-77364031-1'),
        SERVER_URL: JSON.stringify(SERVER_URL),
        DEFAULT_PASSWORD: JSON.stringify(process.env.DEFAULT_PASSWORD),
        GRAPHQL_ENDPOINT: JSON.stringify(process.env.GRAPHQL_ENDPOINT),
        APPX_ENV: JSON.stringify('client'),
        PARSE_MODULE_PATH: JSON.stringify('parse'),
      }
    }),
    // Avoid publishing files when compilation fails
    new webpack.NoErrorsPlugin(),
    new AssetsPlugin({ prettyPrint: true }),

    // new webpack.optimize.DedupePlugin(),

    // new webpack.LoaderOptionsPlugin({
    //   minimize: true,
    //   debug: false
    // }),

    new webpack.HotModuleReplacementPlugin(),
  ],
  resolve: {
    modulesDirectories: ['node_modules', 'js'],
    alias: {

    },
  },
};
