import Parse from 'parse/node';

import moment from 'moment';

import {
  ADD_OR_UPDATE_FORM,
  DELETE_FORM,
  GENERATE_PDF,
  GET_FORMS,
} from '../../backend/constants';

export class Forms {
  constructor({ connector, user }) {
    this.connector = connector;
    this.user = user;
  }

  addOrUpdateForm(id, { type, companyId, data, }){
    return Parse.Cloud.run(
      'routeOp',
      { __operationKey: ADD_OR_UPDATE_FORM, args: { id, type, companyId, data } },
      { sessionToken: this.user.sessionToken }
    );
  }

  delForm(id){
    return Parse.Cloud.run(
      'routeOp',
      { __operationKey: DELETE_FORM, args: { id } },
      { sessionToken: this.user.sessionToken }
    );
  }

  getForm(id){
    return this.connector.get(id);
  }

  getPdf(id){
    return Parse.Cloud.run(
      'routeOp',
      { __operationKey: GENERATE_PDF, args: { id } },
      { sessionToken: this.user.sessionToken }
    );
  }

  getAllForms(companyId){
    return this.connector.getAll(companyId);
  }

  getFormsByPage(companyId, from, to) {
    return this.connector.getFormsByPage(companyId, from, to);
  }
  extrapolation(id, timestamp) {
    const self = this;
    const to = moment.utc(timestamp);

    function count() {
      return self.connector.countAll(id);
    }

    function extrapolatePages() {
      return self.connector.extrapolatePages(id, to);
    }

    const queries = [
      count(),
      extrapolatePages()
    ];

    return Promise.all(queries).then(function ([ totalLength, pages ]) {
      return {
        totalLength,
        timestamp: to.toDate(),
        pages,
      };
    });
  }
}


