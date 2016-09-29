const errorFormater = require('error-formatter');

const { Company, } = require('./types');

function newPointer({className, id}){
  const Obj = Parse.Object.extend(className);
  return Obj.createWithoutData(id);
}

function makeAlias(designation){
  return !!designation ? String(designation).toLowerCase().split(/\s+/).join('_') : undefined;
}

function withCompany(id, cb){
  const query = new Parse.Query(Company);
  query.get(id, {
    success(company){ cb(null, company); },
    error(err){ cb(err); },
  })
}

module.exports = { withCompany, formatError: errorFormater, newPointer, makeAlias, };
