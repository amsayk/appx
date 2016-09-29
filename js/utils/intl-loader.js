import { addLocaleData, } from 'react-intl';

const loaders = {
  fr(callback, force) {
    if (! window.Intl || force) {
      require.ensure([], (require) => {
        require('intl');
        require('intl/locale-data/jsonp/fr.js');
        addLocaleData(require('react-intl/locale-data/fr.js'));
        callback({messages: {}});
      });
    } else {
      require.ensure([], (require) => {
        addLocaleData(require('react-intl/locale-data/fr.js'));
        callback({messages: {}});
      });
    }
  }

};

export default (locale, force = false) => {
  return new Promise((resolve) => {
    const fn = loaders[locale];
    fn(resolve, force);
  });
};
