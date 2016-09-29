import memoize from 'lru-memoize';

import moment from 'moment';

import orderBy from 'lodash.orderby';

const extrapolate = memoize(12)(function (since) {
  const end = moment.utc(since).startOf('day');

  const today = moment.utc().startOf('day');
  const startOfThisWeek = moment.utc(today).startOf('week').startOf('day');
  const startOfThisMonth = moment.utc(today).startOf('month').startOf('day');
  const startOfThisYear = moment.utc(today).startOf('year').startOf('day');

  const periods = [{
    id: `day-${today.day()}`,
    title: getDayOfWeekTitle(0),
    from: today,
    items: [],
  }];

  // Add all days of this week
  [ -1, -2, -3, -4, -5, -6, ].forEach(function (index) {
    const startOfDay = moment.utc(today).add(index, 'days').startOf('day');

    if(startOfDay.isAfter(end) && ! isLastWeek(startOfDay)){
      periods.push({
        id: `day-${startOfDay.day()}`,
        title: getDayOfWeekTitle(index),
        from: moment.utc(startOfDay),
        to: moment.utc(startOfDay).endOf('day'),
        items: [],
      });
    }
  });

  // Add all weeks of this month
  [ -1, -2, -3 ].forEach(function (index) {
    const startOfWeek = moment.utc(today).add(index, 'weeks').startOf('week').startOf('day');
    if(startOfWeek.isAfter(end) && ! isLastMonth(startOfWeek)){
      periods.push({
        id: `week-${startOfWeek.week()}`,
        title: getWeekOfMonthTitle(index),
        from: moment.utc(startOfWeek),
        to: moment.utc(startOfWeek).endOf('week').endOf('day'),
        items: [],
      });
    }
  });

  // Add all months of this year
  [ -1, -2, -3, -4, -5, -6, -7, -8, -9, -10, -11 ].forEach(function (index) {
    const startOfMonth = moment.utc(today).add(index, 'months').startOf('month').startOf('day');
    if(startOfMonth.isAfter(end) && ! isLastYear(startOfMonth)){
      periods.push({
        id: `month-${startOfMonth.month()}`,
        title: getMonthOfYearTitle(index),
        from: moment.utc(startOfMonth),
        to: moment.utc(startOfMonth).endOf('month').endOf('day'),
        items: [],
      });
    }
  });

  // Add all years upto end
  let curYear = startOfThisYear.add(-1, 'year').startOf('year').startOf('day');
  while (curYear.isAfter(end)) {
     periods.push({
       id: `year-${curYear.year()}`,
       title: String(curYear.year()),
       from: moment.utc(curYear),
       to: moment.utc(curYear).endOf('year').endOf('day'),
       items: [],
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

  function getDayOfWeekTitle(index){
    switch (index) {
      case  0: return 'aujourd\'hui';
      case -1: return 'hier';
    }
    return moment.utc().day(today.day() + index).format('dddd');
  }


  function getWeekOfMonthTitle(index){
    switch (index) {
      case -1: return 'la semaine derniere';
    }
    return `il y a ${Math.abs(index)} semaines`;
  }

  function getMonthOfYearTitle(index){
    return moment.utc().month(today.month() + index).format('MMMM YYYY');
  }
});


export function createOps(forms, since) {
  return extrapolate(since).map(function ({ from, to, id, title }) {
    return {
      id,
      title,
      items: orderBy(getFormsMatching({ from, to }, [ 'timestamp' ], [ 'desc' ])),
    };
  });

  function getFormsMatching({ from, to }) {
    return forms.filter((f) => moment.utc(new Date(f.timestamp)).isBetween(from, to || moment(), null, '[]'));
  }
};
