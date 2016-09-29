const Parse = require('parse/node');

const {
  ADD_OR_UPDATE_FORM,
  DELETE_FORM,
  GENERATE_PDF,
  GET_FORMS,
} = require('../../backend/constants');

class Forms {
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

  getForms(companyId, { offset, limit = 25 }){
    return this.connector.getAllPage(companyId, { offset, limit });
  }

  getAllForms(companyId){
    return this.connector.getAll(companyId);
  }
}

module.exports = { Forms: process.env.MOCK ? require('./utils').MockForms : Forms };
