import { locales } from '../utils/i18n';

const __locale = 'fr';

require('moment').locale(__locale, locales[__locale]);

import { createWorker, } from 'redux-worker';

import { Search } from 'js-search';

import isEmpty from 'lodash.isempty';

const worker = createWorker();

worker.registerTask('FILTER_OPS', function () {

  const jsSearch = new Search('id');
  jsSearch.addIndex('displayName');
  jsSearch.addIndex('type');

  function doSearch(forms, filterText){
    if(isEmpty(filterText)){
      return [];
    }

    jsSearch.addDocuments(forms);
    return jsSearch.search(filterText);
  }

  return function ({ filterText, version, forms }) {

    return {
      version,
      results: doSearch(forms, filterText),
    };
  };
}());


