import { createSelector } from 'utils/reselect';

const getSelectedCompany = (state) => state.getIn([ 'sidebar', 'selectedCompanyId' ]);

export default createSelector(
  [ getSelectedCompany ],
  (selectedCompanyId) => ({ selectedCompanyId, })
);
