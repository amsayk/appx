const Parse = require('parse/node');

const {
  UPDATE_PROFILE,
  CHANGE_PASSWORD,
} = require('../../backend/constants');

class Users {
  constructor({ user, connector, }) {
    this.user = user;
    this.connector = connector;
  }

  updateProfile(info){
    return Parse.Cloud.run(
      'routeOp',
      { __operationKey: UPDATE_PROFILE, args: info, },
      { sessionToken: this.user.sessionToken, }
    );
  }

  changePassword(newPassword){
    return Parse.Cloud.run(
      'routeOp', { __operationKey: CHANGE_PASSWORD, args: { newPassword, }, },
      { sessionToken: this.user.sessionToken, }
    );
  }

  getUser(id){
    return this.connector.get(id);
  }
}

module.exports = {Users};
