import { Company, Form } from '../types';

import { makeAlias } from '../utils';

import makeWords from '../makeWords';

import { formatError } from '../utils';

export default function addOrUpdateCompany(request, response){
  const company = new Company();

  const { id, data, } = request.params;

  if (typeof id !== 'undefined') {
    company.id = id;

    return company.fetch().then(function (obj) {

      data.forEach(function({ fieldName, value, }){
        obj.set(fieldName, value);

        if(fieldName === 'displayName'){
          obj.set('displayNameLowerCase', makeAlias(value));
        }
      });

      obj.set('words', makeWords([
        obj.get('displayName'),
        obj.get('activity'),
      ]));

      return obj.save(null);
    }).then(
      function (object) {
        response.success({id: object.id});
      },
      function (error) {
        response.error(formatError(error));
      }
    );
  } else {
    company.set('kind', 'Company');
  }

  data.forEach(function({ fieldName, value, }){
    company.set(fieldName, value);

    if(fieldName === 'displayName'){
      company.set('displayNameLowerCase', makeAlias(value));
    }
  });

  company.set('user', request.user);

  company.set('words', makeWords([
    company.get('displayName'),
    company.get('activity'),
  ]));

  return company.save(null).then(
    function (object) {
      response.success({id: object.id});
    },
    function (error) {
      response.error(formatError(error));
    }
  );
}


