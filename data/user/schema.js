const parseGraphqlScalarFields = require('../parseGraphqlScalarFields');

const schema = [`

  type User{
    objectId: ID!

    avatar: File

    displayName: String!
    email: String!
    username: String!
    sessionToken: String!

    createdAt: Date!
    updatedAt: Date
  }

`];

const resolvers = {

  User: Object.assign(
    {
      avatar(obj){
        return getObjectFile(obj, 'Avatar');
      }
    },
    parseGraphqlScalarFields([ 'objectId', 'displayName', 'email', 'username', 'sessionToken', 'createdAt', 'updatedAt', ])
  ),

  Mutation: {
    updateProfile(_, { fields }, context) {
      if (! context.user) {
        throw new Error('Must be logged in.');
      }

      return Promise.resolve().then(function(){
        return null;
      });
    },
    changePassword(_, { newPassword }, context) {
      if (! context.user) {
        throw new Error('Must be logged in.');
      }

      return Promise.resolve().then(function(){
        return null;
      });
    },
  },

};

module.exports = {schema, resolvers};
