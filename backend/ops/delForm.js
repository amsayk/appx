import { Form } from '../types';
import { formatError } from '../utils';

export default function delForm(request, response) {
  const form = new Form();
  form.id = request.params.id;

  return form.destroy().then(
    function () {
      response.success({ deletedFormId: request.params.id })
    },
    function (error) {
      response.error(formatError(error));
    }
  );
}

