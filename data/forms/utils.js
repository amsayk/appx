const memoize = require('lru-memoize');

const casual = require('casual');

const moment = require('moment');

import find from 'lodash.findindex';

const Parse = require('parse/node');

import uuid from 'node-uuid';

const {
  GENERATE_PDF,
} = require('../../backend/constants');

import take from 'lodash.take';

import dropWhile from 'lodash.dropwhile';

import orderBy from 'lodash.orderby';

const extrapolate = memoize(12)(function (since) {
  const end = moment.utc(since).startOf('day');

  const today = moment.utc().startOf('day');
  const startOfThisWeek = moment.utc(today).startOf('week').startOf('day');
  const startOfThisMonth = moment.utc(today).startOf('month').startOf('day');
  const startOfThisYear = moment.utc(today).startOf('year').startOf('day');

  const periods = [{
    from: today,
  }];

  // Add all days of this week
  [ -1, -2, -3, -4, -5, -6, ].forEach(function (index) {
    const startOfDay = moment.utc(today).add(index, 'days').startOf('day');

    if(startOfDay.isAfter(end) && ! isLastWeek(startOfDay)){
      periods.push({
        from: moment.utc(startOfDay),
        to: moment.utc(startOfDay).endOf('day'),
      });
    }
  });

  // Add all weeks of this month
  [ -1, -2, -3 ].forEach(function (index) {
    const startOfWeek = moment.utc(today).add(index, 'weeks').startOf('week').startOf('day');
    if(startOfWeek.isAfter(end) && ! isLastMonth(startOfWeek)){
      periods.push({
        from: moment.utc(startOfWeek),
        to: moment.utc(startOfWeek).endOf('week').endOf('day'),
      });
    }
  });

  // Add all months of this year
  [ -1, -2, -3, -4, -5, -6, -7, -8, -9, -10, -11 ].forEach(function (index) {
    const startOfMonth = moment.utc(today).add(index, 'months').startOf('month').startOf('day');
    if(startOfMonth.isAfter(end) && ! isLastYear(startOfMonth)){
      periods.push({
        from: moment.utc(startOfMonth),
        to: moment.utc(startOfMonth).endOf('month').endOf('day'),
      });
    }
  });

  // Add all years upto end
  let curYear = startOfThisYear.add(-1, 'year').startOf('year').startOf('day');
  while (curYear.isAfter(end)) {
     periods.push({
       from: moment.utc(curYear),
       to: moment.utc(curYear).endOf('year').endOf('day'),
     });

    curYear = curYear.add(-1, 'year').startOf('year').startOf('day');
  }


  return periods;

  function isLastWeek(date){
    return moment.utc(date).isBefore(startOfThisWeek);
  }

  function isLastMonth(date) {
    return moment.utc(date).isBefore(startOfThisMonth);
  }

  function isLastYear(date) {
    return moment.utc(date).isBefore(startOfThisYear);
  }

});

function randomDate(start, end, startHour, endHour) {
  const date = new Date(+start + Math.random() * (end - start));
  const hour = startHour + Math.random() * (endHour - startHour) | 0;
  date.setHours(hour);
  return date;
}

casual.define('form', function (timestamp){
  return {
    id: uuid.v4(),
    displayName: casual.title,
    type: casual.random_element([ 'CNSS', 'IR', 'IS', 'VAT' ]),
    createdAt: timestamp,
    updatedAt: timestamp,
    timestamp: timestamp,
  };
});


let forms = [];

const since = moment.utc().add(-15, 'years');

extrapolate(since).forEach(function ({ from, to }) {
  const array = [];

  for (let i = 0, len = casual.integer(25, 50); i < len; i++ ) {
    const end = (to || moment());
    const timestamp = randomDate(
      from.toDate(), end.toDate(), from.hour() + 1, end.hour() - 1);

    array.push(casual.form(timestamp));
  }

  forms.push(...orderBy(array, [ 'timestamp' ], [ 'desc' ]));
});


class MockForms {
  constructor({ connector, user}) {
    this.connector = connector;
    this.user = user;
  }

  addOrUpdateForm(id, { type, companyId, data, }){
    if (! id) {
      const formData = {
        id: uuid.v4(),
        type,
        ...data.reduce((res, { fieldName, value }) => ({ ...res, [fieldName]: value }), {}),
        timestamp: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      forms.unshift(formData);
      return Promise.resolve(formData);
    }

    return this.getForm(id).then((form) => {
      return this.delForm(id).then(function () {
        const newForm = {
          ...form,
          ...data.reduce((res, { fieldName, value }) => ({ ...res, [fieldName]: value }), {}),
          timestamp: new Date(),
          updatedAt: new Date(),
        };
        forms.unshift(newForm);
        return newForm;
      });
    });
  }

  delForm(id){
    return Promise.resolve().then(function () {
      forms = forms.filter((f) => f.id !== id);
      return { deletedFormId: id };
    });
  }

  getForm(id, touch = false){
    return Promise.resolve().then(function () {
      const index = find(forms, (f) => f.id === id);
      const form = index !== -1 ? forms[index] : null;


      if (form && touch) {
        return this.delForm(id).then(function () {
          const newForm = {
            ...form,
            timestamp: new Date(),
          };
          forms.unshift(newForm);
          return newForm;
        });
      }

      return form;
    });
  }

  getPdf(id){
    return Parse.Cloud.run(
      'routeOp',
      { __operationKey: GENERATE_PDF, args: { id, } },
      { sessionToken: this.user.sessionToken }
    );
  }

  getForms(companyId, { offset, limit = 27 }){
    const timestamp = offset && moment.utc(new Date(parseInt(offset)));
    const col = timestamp ? dropWhile(forms, (f) => moment.utc(new Date(f.timestamp)).isSameOrAfter(timestamp)) : forms;
    return take(col, limit);
  }

  getAllForms(companyId){
    return forms;
  }
}


module.exports = { MockForms };
