import { Company, Form } from '../types';

import { makeAlias } from '../utils';

import makeWords from '../makeWords';

import { formatError } from '../utils';

import casual from 'casual';

import orderBy from 'lodash.orderby';

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
      if (process.env.MOCK_FORMS === 'true') {
        mockCompanyForms(object);
      }
      response.success({id: object.id});
    },
    function (error) {
      response.error(formatError(error));
    }
  );
}

// Not completely safe but works in this case
function mockCompanyForms(company) {
  const isMocked = company.has('isMocked') ? company.get('isMocked') : false;

  if (isMocked) {
    console.log('[MOCK]: already done.');
    return Promise.resolve();
  }

  company.set('isMocked', true);
  return company.save(null).then(function () {

    function randomDate(start, end, startHour, endHour) {
      const date = new Date(+start + Math.random() * (end - start));
      const hour = startHour + Math.random() * (endHour - startHour) | 0;
      date.setHours(hour);
      return date;
    }

    casual.define('form', function (timestamp){
      return {
        displayName: casual.title,
        type: casual.random_element([ 'CNSS', 'IR', 'IS', 'VAT' ]),
        timestamp: timestamp,
      };
    });


    let forms = [];
    let to = moment.utc();

    const s = moment.utc().add(-1 * parseInt(process.env.MOCK_SINCE_DATE), 'years');

    extrapolate(s, to).forEach(function ({ id, from, to : end, title }) {
      const array = [];

      for (let i = 0, len = casual.integer(25, 50); i < len; i++ ) {
        const timestamp = randomDate(
          moment.utc(from).add(1, 'hour').toDate(), moment.utc(end).add(1, 'hour').toDate(), from.hour() + 1, (to.isSame(end, 'day') ? to.hour() + 1 : end.hour()));

        array.push(casual.form(timestamp));
      }

      forms.push(...orderBy(array, [ 'timestamp' ], [ 'desc' ]));
    });

    console.log('[MOCK]: start');

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
      });
      return f;
    })).then(() => {
      console.log('MOCK: done, ', forms.length, ' forms added.');
    });
  });

}

