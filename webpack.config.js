module.exports = process.env.NODE_ENV !== 'production'
  ? require('./webpack/webpack.config.dev.js')
  : require('./webpack/webpack.config.production.js');
