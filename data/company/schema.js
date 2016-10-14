import parseGraphqlScalarFields from '../parseGraphqlScalarFields';
import getObjectFile from '../getObjectFile';

export const schema = [`

  enum LegalForm {
    AU
    SNC
    SARL
    SARL_AU
  }

  type Company{
    id: ID!
    displayName: String!

    logo: File

    legalForm: LegalForm
    activity: String
    email: String
    fax: String
    webSite: String

    streetAddress: String
    cityTown: String
    stateProvince: String
    postalCode: String
    country: String

    ice: String
    rc: String
    patente: String
    cnss: String
    banque: String
    rib: String

    createdAt: Date!
    updatedAt: Date
  }

  type AddCompanyOutput{
    company: Company!
  }

  type DelCompanyOutput{
    deletedCompanyId: ID!
  }

`];

export const resolvers = {

  Company: Object.assign(
    {
      logo(obj){
        return getObjectFile(obj, 'Logo');
      }
    },
    parseGraphqlScalarFields([ 'id', 'displayName', 'legalForm', 'activity', 'email', 'fax', 'webSite', 'streetAddress', 'cityTown', 'stateProvince', 'postalCode', 'country', 'ice', 'rc', 'patente', 'cnss', 'banque', 'rib', 'createdAt', 'updatedAt', ])
  ),

  AddCompanyOutput: Object.assign(
    {
    },
    parseGraphqlScalarFields([ 'company' ])
  ),

  Query: {

    companies(_, {}, context){
      return context.Companies.getCompanies();
    },

    company(_, { id, }, context){
      return Promise.resolve()
        .then(() => {
          return context.Companies.getCompany(id);
        });
    },

  },

  Mutation: {
    addOrUpdateCompany(_, { id, fields }, context) {
      if (! context.user) {
        throw new Error('Must be logged in.');
      }

      return Promise.resolve()
        .then(() => (
          context.Companies.addOrUpdateCompany(id, {data: fields})
            .catch(() => {
              throw new Error(`Couldn't add comany`);
            })
        ))
        .then(({ id }) => (
          { company: context.Companies.getCompany(id), }
        ));
    },
    delCompany(_, { id }, context) {
      if (! context.user) {
        throw new Error('Must be logged in.');
      }

      return Promise.resolve()
        .then(() => (
          context.Companies.delCompany(id)
            .catch(() => {
              throw new Error(`Couldn't delete company`);
            })
        ));
    },
  },
};

