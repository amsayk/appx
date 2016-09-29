import { createSelector } from '../../../utils/reselect';

import { Search, } from 'js-search';

import isEmpty from 'lodash.isempty';

const getCompanies = (_, props) => props.companies;
const getFilterText = (state) => state.getIn([ 'sidebar', 'filterText' ]);
const selectedCompany = (state) => state.getIn([ 'sidebar', 'selectedCompanyId' ]);

export default createSelector(
  [ getCompanies, getFilterText, selectedCompany ],
  (companies, filterText, selectedCompanyId) => ({ companies: doSearch(companies, filterText), filterText, selectedCompanyId })
);

const jsSearch = new Search('objectId');
jsSearch.addIndex('displayName');

function doSearch(companies, filterText){
  if(isEmpty(filterText)){
    return companies;
  }

  jsSearch.addDocuments(companies);
  return jsSearch.search(filterText);
}
