import cookie from 'react-cookie';

import {
  isServer,
  INIT,
} from 'utils/environment';

import {
  FILTER_COMPANIES,
  TOGGLE_PROFILE_MENU,
  TOGGLE_SIDEBAR, TOGGLE_SIDEBAR_GROUP, SELECT_COMPANY,
} from './constants';

import Immutable from 'immutable';

const initialState = Immutable.fromJS({
  filterText: '',
  menuOpen: false,
  sidebarCollapsed: false,
  groupExpanded: -1,
  selectedCompanyId: cookie.load('selectedCompanyId', /* doNotParse = */true),
});

export default function reducer(state = initialState, action) {
  switch (action.type) {

    case TOGGLE_SIDEBAR:

      return state.merge({
        sidebarCollapsed: ! state.get('sidebarCollapsed'),
      });

    case TOGGLE_SIDEBAR_GROUP:

      return state.merge({
        groupExpanded: action.groupExpanded,
      });

    case SELECT_COMPANY:

      return state.merge({
        selectedCompanyId: action.selectedCompanyId,
      });

    case FILTER_COMPANIES:

      return state.merge({
        filterText: action.filterText,
      });

    case TOGGLE_PROFILE_MENU:

      return state.merge({
        menuOpen: ! state.get('menuOpen'),
      });

    case INIT:

      return isServer ? state.merge({
        selectedCompanyId: cookie.load('selectedCompanyId', /* doNotParse = */true),
      }) : state;

    default:
      return state;
  }
}
