module.exports = function parseGraphqlScalarFields(fields){
  return fields.reduce(function(fields, fieldName) {
    fields[fieldName] = (obj) => {
      const value = obj[fieldName] || obj.get(fieldName);
      return value
        ? (value.toJSON ? value.toJSON() : value)
        : null;
    }
    return fields;
  }, {});
};
