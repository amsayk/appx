import {
  FILTER_COMPANIES,
  TOGGLE_PROFILE_MENU,
  TOGGLE_SIDEBAR, TOGGLE_SIDEBAR_GROUP, SELECT_COMPANY,
} from './constants';

export function toggle() {
  return {
    type: TOGGLE_SIDEBAR,
  }
}

export function toggleGroup(id) {
  return {
    type: TOGGLE_SIDEBAR_GROUP,
    groupExpanded: id,
  }
}

export function selectCompany(id) {
  return {
    type: SELECT_COMPANY,
    selectedCompanyId: id,
  }
}

export function filterCompanies(query){
  return {
    type: FILTER_COMPANIES,
    filterText: query,
  };
}

export function toggleProfileMenu() {
  return {
    type: TOGGLE_PROFILE_MENU,
  };
}
