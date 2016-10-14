export { default as formatError } from 'error-formatter';

import { Company } from './types';

export function makeAlias(designation){
  return !!designation ? String(designation).toLowerCase().split(/\s+/).join('_') : undefined;
}

export function withCompany(id, cb){
  const query = new Parse.Query(Company);
  query.get(id, {
    success(company){ cb(null, company); },
    error(err){ cb(err); },
  });
}

