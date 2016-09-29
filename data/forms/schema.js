const parseGraphqlScalarFields = require('../parseGraphqlScalarFields');

const schema = [`

  enum FormType{
    CNSS
    IR
    IS
    VAT
  }

  type CNSS implements Form{
    objectId: ID!
    displayName: String
    type: FormType!
    createdAt: Date!
    updatedAt: Date
    timestamp: Date!
  }
  type IR implements Form{
    objectId: ID!
    displayName: String
    type: FormType!
    createdAt: Date!
    updatedAt: Date
    timestamp: Date!
  }
  type IS implements Form{
    objectId: ID!
    displayName: String
    type: FormType!
    createdAt: Date!
    updatedAt: Date
    timestamp: Date!
  }
  type VAT implements Form{
    objectId: ID!
    displayName: String
    type: FormType!
    createdAt: Date!
    updatedAt: Date
    timestamp: Date!
  }

  interface Form {
    objectId: ID!
    displayName: String
    type: FormType!
    createdAt: Date!
    updatedAt: Date
    timestamp: Date!
  }

  type AddFormOutput{
    form: Form!
  }

  type DelFormOutput{
    deletedFormId: ID!
  }

`];

const resolvers = {

  Form: {
    __resolveType(obj, context, info){
      const type = obj.type || obj.get('type');
      switch(type){
        case 'CNSS': return info.schema.getType('CNSS');
        case 'IR':   return info.schema.getType('IR');
        case 'IS':   return info.schema.getType('IS');
        case 'VAT':  return info.schema.getType('VAT');
      }
      return null;
    },
  },

  CNSS: Object.assign(
    {
    },
    parseGraphqlScalarFields([ 'objectId', 'displayName', 'type', 'createdAt', 'updatedAt', 'timestamp', ])
  ),
  IR: Object.assign(
    {
    },
    parseGraphqlScalarFields([ 'objectId', 'displayName', 'type', 'createdAt', 'updatedAt', 'timestamp', ])
  ),
  IS: Object.assign(
    {
    },
    parseGraphqlScalarFields([ 'objectId', 'displayName', 'type', 'createdAt', 'updatedAt', 'timestamp', ])
  ),
  VAT: Object.assign(
    {
    },
    parseGraphqlScalarFields([ 'objectId', 'displayName', 'type', 'createdAt', 'updatedAt', 'timestamp', ])
  ),

  AddFormOutput: Object.assign(
    {},
    parseGraphqlScalarFields([ 'form' ])
  ),

  Mutation: {
    addOrUpdateForm(_, { id, type, companyId, fields, }, context) {
      if (! context.user) {
        throw new Error('Must be logged in.');
      }

      return Promise.resolve()
        .then(() => (
          context.Forms.addOrUpdateForm(id, { type, companyId, data: fields, })
            .catch(() => {
              throw new Error(`Couldn't add form`);
            })
        ))
        .then(({ id }) => (
          { form: context.Forms.getForm(id), }
        ));
    },
    getFormPdf(_, { id, }, context) {
      if (! context.user) {
        throw new Error('Must be logged in.');
      }

      return Promise.resolve()
        .then(() => (
          context.Forms.getPdf(id)
            .catch(() => {
              throw new Error(`Couldn't retreive pdf`);
            })
        ));
    },
    delForm(_, { id }, context) {
      if (! context.user) {
        throw new Error('Must be logged in.');
      }

      return Promise.resolve()
        .then(() => (
          context.Forms.delForm(id)
            .catch(() => {
              throw new Error(`Couldn't delete form`);
            })
        ));
    },
  },

  Query: {

    form(_, { id, }, context){
      if (! context.user) {
        throw new Error('Must be logged in.');
      }

      return Promise.resolve()
        .then(() => {
          return context.Forms.getForm(id);
        });
    },

    forms(_, { companyId, offset }, context) {
       if (! context.user) {
        throw new Error('Must be logged in.');
      }

      return Promise.resolve()
        .then(() => {
          return context.Forms.getForms(companyId, { offset });
        });
    },

    allForms(_, { companyId }, context) {
       if (! context.user) {
        throw new Error('Must be logged in.');
      }

      return Promise.resolve()
        .then(() => {
          return context.Forms.getAllForms(companyId);
        });
    },

  },

};

module.exports = {schema, resolvers};
