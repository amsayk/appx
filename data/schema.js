import { schema as companySchema, resolvers as companyResolvers } from './company/schema';
import { schema as formsSchema, resolvers as formsResolvers } from './forms/schema';
import { schema as userSchema, resolvers as userResolvers } from './user/schema';

import merge from 'lodash.merge';

import moment from 'moment';

import parseGraphqlObjectFields from './parseGraphqlObjectFields';
import parseGraphqlScalarFields from './parseGraphqlScalarFields';
import parseJSONLiteral from './parseJSONLiteral';

const rootSchema = [`

  scalar Date

  scalar JSON

  scalar Nothing

  type Pdf {
    url: String!
  }

  type File {
    id: ID!
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
    allForms(companyId: ID!): [Form!]!

    formsByPage(companyId: ID!, from: String!, to: String!): [Form!]!
    extrapolation(companyId: ID!): Extrapolation!
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
      if (value instanceof Date){
        return value.getTime();   // value sent to the client
      }

      if (moment.isMoment(value)) {
        return value.valueOf();  // value sent to the client
      }

      throw new Error('Invalid date: ' + value);
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
    parseGraphqlScalarFields([ 'id', 'name', 'contentType', 'url', 'createdAt', 'updatedAt', ])
  ),

};

export const schema = [
  ...rootSchema,
  ...userSchema,
  ...companySchema,
  ...formsSchema
];

export const resolvers = merge(rootResolvers, companyResolvers, formsResolvers, userResolvers);


