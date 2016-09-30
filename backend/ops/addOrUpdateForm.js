import { Form } from '../types';

import { withCompany, makeAlias, formatError } from '../utils';

import makeWords from '../makeWords';

export default function addOrUpdateForm(request, response){
  const form = new Form();

  const { id, companyId, type, data, } = request.params;

  if (typeof id !== 'undefined') {
    form.id = id;

    return form.fetch().then(function (obj) {

      data.forEach(function({ fieldName, value, }){
        obj.set(fieldName, value);

        if(fieldName === 'displayName'){
          obj.set('displayNameLowerCase', makeAlias(value));
        }
      });

      obj.set('timestamp', new Date());

      obj.set('words', makeWords([
        obj.get('displayName'),
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
  }

  withCompany(companyId, function(error, company){

    if(error){
      response.error(formatError(error));
      return;
    }

    form.set('kind', 'Form');

    form.set('type', type);

    form.set('company', company);

    data.forEach(function({ fieldName, value, }){
      form.set(fieldName, value);

      if(fieldName === 'displayName'){
        form.set('displayNameLowerCase', makeAlias(value));
      }
    });

    form.set('user', request.user);
    form.set('timestamp', new Date());

    form.set('words', makeWords([
      form.get('displayName'),
    ]));

    return form.save(null).then(
      function (object) {
        response.success({id: object.id});
      },
      function (error) {
        response.error(error);
      }
    );
  });

}

