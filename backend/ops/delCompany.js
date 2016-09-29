const { Company, } = require('../types');
const { formatError, } = require('../utils');

function delCompany(request, response) {
  const company = new Company();
  company.id = request.params.id;

  company.set('deleted', true);

  return company.save(null).then(
    function (result) {
      response.success({deletedCompanyId: result.id})
    },

    function (error) {
      response.error(formatError(error));
    }
  );
}

module.exports = delCompany;
