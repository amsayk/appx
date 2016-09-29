const { Form, } = require('../types');
const { formatError, } = require('../utils');

function delForm(request, response) {
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

module.exports = delForm;
