import { addLocaleData, } from 'react-intl';

const loaders = {
  fr() {
    addLocaleData(require('react-intl/locale-data/fr.js'));
    return { messages: {} };
  }

};

module.exports = (locale) => {
  return loaders[locale]();
};
