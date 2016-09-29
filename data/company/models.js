const Parse = require('parse/node');

const {
  ADD_OR_UPDATE_COMPANY,
  DELETE_COMPANY,
  GENERATE_PDF
} = require('../../backend/constants');

class Companies {
  constructor({ connector, user }) {
    this.connector = connector;
    this.user = user;
  }

  addOrUpdateCompany(id, { data }){
    return Parse.Cloud.run(
      'routeOp',
      { __operationKey: ADD_OR_UPDATE_COMPANY, args: { id, data, }, },
      { sessionToken: this.user.sessionToken, }
    );
  }

  delCompany(id){
    return Parse.Cloud.run(
      'routeOp',
      { __operationKey: DELETE_COMPANY, args: { id, }, },
      { sessionToken: this.user.sessionToken, }
    );
  }

  getCompany(id){
    return this.connector.get(id);
  }

  getCompanies(){
    return this.connector.getAll();
  }
}

module.exports = {Companies};
