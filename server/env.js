const path = require('path');

// Add the root project directory to the app module search path:
require('app-module-path').addPath(path.resolve(process.cwd(), 'js'));

const babel = require('babel-register');

const __PRODUCTION__ = process.env.NODE_ENV === 'production';

babel({
  presets: [ 'react-native' ],
  plugins: [
    'transform-runtime',
    'transform-export-extensions'
  ],
  babelrc: false,
  env: {
    production: {
      minified: true,
      plugins: [
        // 'transform-react-remove-prop-types',
        // 'transform-react-constant-elements',
        // 'transform-react-inline-elements'
      ] : [],
    },
  },
});

const sass = require('node-sass');

const cssRequireHook = require('css-modules-require-hook');

cssRequireHook({
  extensions: [ '.scss' ],
  generateScopedName: __PRODUCTION__ ? '[hash:base64:5]' : '[name]__[local]___[hash:base64:5]',
  preprocessCss: (data, filename) =>
      sass.renderSync({
        data,
        file: filename,
      }).css,
});

require('./parse-config');

require('isomorphic-fetch');
