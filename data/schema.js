const { schema : companySchema, resolvers : companyResolvers,  } = require('./company/schema');
const { schema : formsSchema, resolvers : formsResolvers,  } = require('./forms/schema');
const { schema : userSchema, resolvers : userResolvers,  } = require('./user/schema');

const merge = require('lodash.merge');

const parseGraphqlObjectFields = require('./parseGraphqlObjectFields');
const parseGraphqlScalarFields = require('./parseGraphqlScalarFields');
const parseJSONLiteral = require('./parseJSONLiteral');

const rootSchema = [`

  scalar Date

  scalar JSON

  scalar Nothing

  type Pdf {
    url: String!
  }

  type File {
    objectId: ID!
    name: String!
    contentType: String!
    url: String!

    user: User

    createdAt: Date!
    updatedAt: Date
  }

  input FieldValueType {
    fieldName: String!
    value: String
  }

  input FileItemInput {
    name: String
    type: String
    size: Float
    dataBase64: String
    isNull: Boolean
  }

  type Query {
    companies: [Company!]!
    company(id: ID!): Company
    form(id: ID!): Form
    forms(companyId: ID!, offset: String): [Form!]!
    allForms(companyId: ID!): [Form!]!
  }

  type Mutation {
    addOrUpdateForm(id: ID, type: FormType!, companyId: ID!, fields: [FieldValueType!]!): AddFormOutput!
    delForm(id: ID!): DelFormOutput!

    addOrUpdateCompany(id: ID, fields: [FieldValueType!]!, logo: FileItemInput): AddCompanyOutput!
    delCompany(id: ID!): DelCompanyOutput!

    updateProfile(fields: [FieldValueType!]!): Nothing
    changePassword(newPassword: String!): Nothing

    getFormPdf(id: ID!): Pdf!
  }

  schema {
    query: Query
    mutation: Mutation
  }

`];

const rootResolvers = {
  Date: {
    __parseValue (value) {
      return new Date(value); // value from the client
    },
    __serialize(value) {
      return value.getTime(); // value sent to the client
    },
    __parseLiteral (ast) {
      if (ast.kind === Kind.INT) {
        return (parseInt(ast.value, 10)); // ast value is always in string format
      }
      return null;
    },
  },

  Nothing: {
    __parseValue (value) {
      return null; // value from the client
    },
    __serialize() {
      return null; // value sent to the client
    },
    __parseLiteral (ast) {
      return null;
    },
  },

  JSON: {
    __parseLiteral: parseJSONLiteral,
    __serialize: value => value,
    __parseValue: value => value,
   },

  File: Object.assign(
    {
    },
    parseGraphqlObjectFields([ 'user' ]),
    parseGraphqlScalarFields([ 'objectId', 'name', 'contentType', 'url', 'createdAt', 'updatedAt', ])
  ),

};

const schema = [
  ...rootSchema,
  ...userSchema,
  ...companySchema,
  ...formsSchema
];

const resolvers = merge(rootResolvers, companyResolvers, formsResolvers, userResolvers);

module.exports = { schema, resolvers };
