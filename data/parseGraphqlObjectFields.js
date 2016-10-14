export default function parseGraphqlScalarFields(fields){
  return fields.reduce(function(fields, fieldName) {
    fields[fieldName] = (obj) => {
      const value = obj[fieldName] || obj.get(fieldName);
      return value
        ? (value.toJSON ? { id: value.id, ...value.toJSON() } : value)
        : null;
    }
    return fields;
  }, {});
};
