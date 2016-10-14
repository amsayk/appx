import { GraphQLNonNull } from 'graphql';

export default function parseGraphqlScalarFields(fields){
  return fields.reduce(function (fields, fieldName) {
    fields[fieldName] = (obj, {}, {}, info) => {
      let value;

      if (obj.get) {
         value = obj.get(fieldName);
      }

      if (value || value === null || value === 0) {
        return value;
      }

      value = obj[fieldName];

      if (value || value === null || value === 0) {
        return value;
      }

      if (info.returnType instanceof GraphQLNonNull) {
        console.log('[resolve]: ', fieldName, ' returned undefined, obj = ', JSON.stringify(obj));
        debugger;
        throw new Error('parseGraphqlScalarFields returned undefined for field `', fieldName, '`');
      }

      return null;
    }
    return fields;
  }, {});
};
