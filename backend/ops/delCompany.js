import { Company } from '../types';
import { formatError } from '../utils';

export default function delCompany(request, response) {
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

