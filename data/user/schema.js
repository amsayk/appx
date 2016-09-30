import parseGraphqlScalarFields from '../parseGraphqlScalarFields';

export const schema = [`

  type User{
    id: ID!

    avatar: File

    displayName: String!
    email: String!
    username: String!
    sessionToken: String!

    createdAt: Date!
    updatedAt: Date
  }

`];

export const resolvers = {

  User: Object.assign(
    {
      avatar(obj){
        return getObjectFile(obj, 'Avatar');
      }
    },
    parseGraphqlScalarFields([ 'id', 'displayName', 'email', 'username', 'sessionToken', 'createdAt', 'updatedAt', ])
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

