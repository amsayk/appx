import { Company, Form } from '../types';

import { makeAlias, withCompany } from '../utils';

import makeWords from '../makeWords';

import { formatError } from '../utils';

import casual from 'casual';

import moment from 'moment';

import { extrapolate } from '../../data/forms/utils';

export default function mockCompanyForms(request, response) {
  const log = request.log;
  const { id, since = process.env.MOCK_SINCE_YEARS, purgeExisting = false, } = request.params;

  function randomDate(start, end, startHour, endHour) {
    const date = new Date(+start + Math.random() * (end - start));
    const hour = startHour + Math.random() * (endHour - startHour) | 0;
    date.setHours(hour);
    return date;
  }

  casual.define('form', function (timestamp) {
    return {
      displayName: casual.title,
      type: casual.random_element([ 'CNSS', 'IR', 'IS', 'VAT' ]),
      timestamp: timestamp,
    };
  });

  return withCompany(id, function (err, company) {

    if (err) {
      response.error(err);
      return;
    }

    if (purgeExisting) {
      const q = new Parse.Query(Form);
      q.equalTo('company', company);
      q.equalTo('isMockData', true);
      return q.find().then(function (mockedForms) {
        return Parse.Object.destroyAll(mockedForms).then(function () {
          log.info('PURGE MOCK: done, ', mockedForms.length, ' forms deleted.');
          return doMock();
        });
      });
    }

    return doMock();

    function doMock() {
      let forms = [];
      let to = moment.utc();

      const s = moment.utc().add(-1 * parseInt(since), 'years');

      extrapolate(s, to).forEach(function ({ id, from, to : end, title }) {
        for (let i = 0, len = casual.integer(25, 50); i < len; i++ ) {
          const timestamp = randomDate(
            moment.utc(from).add(1, 'hour').toDate(), moment.utc(end).add(1, 'hour').toDate(), from.hour() + 1, (to.isSame(end, 'day') ? to.hour() + 1 : end.hour()));

          forms.push(casual.form(timestamp));
        }
      });

      return Parse.Object.saveAll(forms.map(({ type, timestamp, displayName }) => {
        const f = new Form();
        f.set({
          kind: 'Form',
          type,
          timestamp,
          displayName,
          displayNameLowerCase: makeAlias(displayName),
          words: makeWords([ displayName ]),
          company,
          isMockData: true,
        });
        return f;
      })).then(() => {
        log.info('MOCK: done, ', forms.length, ' forms added.');
        response.success({ id: company.id });
      });
    }

  });

}

