module.exports = function parseGraphqlScalarFields(fields){
  return fields.reduce(function(fields, fieldName) {
    fields[fieldName] = (obj) => {
      switch (fieldName) {
        case 'objectId': return obj.id;
        default: return obj[fieldName] || obj.get(fieldName) || null;
      }
    }
    return fields;
  }, {});
};
