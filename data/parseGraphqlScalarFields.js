export default function parseGraphqlScalarFields(fields){
  return fields.reduce(function(fields, fieldName) {
    fields[fieldName] = (obj) => {
      switch (fieldName) {
        default: return obj[fieldName] || obj.get(fieldName) || null;
      }
    }
    return fields;
  }, {});
};
