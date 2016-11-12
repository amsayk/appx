import DataLoader from 'dataloader';

import Parse from 'parse/node';

import moment from 'moment';

const Type = Parse.Object.extend('Form');
const Company = Parse.Object.extend('Company');

import { extrapolate } from './utils';

export class FormsConnector {
  constructor() {
    this.loader = new DataLoader(this.fetch.bind(this), {
    });

    this.formsLoader = new DataLoader(this.loadForms.bind(this), {
      cacheKeyFn: ([ id, from, to ]) => [ id, from, to ].join(':')
    });

    this.countsLoader = new DataLoader(this.loadCounts.bind(this), {
    });

    this.extrapolationsLoader = new DataLoader(this.loadExtrapolations.bind(this), {
      cacheKeyFn: ([ id, to ]) => [ id, to ].join(':')
    });

    this.allLoader = new DataLoader(this.loadAll.bind(this), {
    });
  }
  fetch(ids) {
    return Promise.all(ids.map((id) => {
      const q = new Parse.Query(Type);
      return q.get(id);
    }));
  }
  loadForms(params) {
    return Promise.all(params.map(([ id, from, to ]) => {
      return new Parse.Query(Type)
        .equalTo('company', Company.createWithoutData(id))
        .greaterThanOrEqualTo('timestamp', new Date(from))
        .lessThanOrEqualTo('timestamp', new Date(to))
        .descending('timestamp')
        .find();
    }));
  }
  loadCounts(ids){
    return Promise.all(ids.map((id) => {
        return new Parse.Query(Type)
            .equalTo('company', Company.createWithoutData(id))
            .count();
        }));
  }
  loadExtrapolations(params){
    return Promise.all(params.map(([ id, to ]) => {
      function countPage(from, to) {
        return new Parse.Query(Type)
          .equalTo('company', Company.createWithoutData(id))
          .greaterThanOrEqualTo('timestamp', new Date(from ))
          .lessThanOrEqualTo('timestamp', new Date(to))
          .count();
      }

      return new Parse.Query(Company).get(id).then(function (company) {
        const s = typeof process.env.MOCK_DATA !== 'undefined'
          ? moment.utc().add(-1 * parseInt(process.env.MOCK_SINCE_YEARS), 'years')
          : moment.utc(company.get('createdAt'));
        return Promise.all(
          extrapolate(s, to).map(function ({ id, from, to, title }) {
            return countPage(from, to).then((length) => ({ id, length, from, to, title }));
          })
        );
      }, function () {
        return [];
      });

    }));
  }
  loadAll(ids) {
    return Promise.all(ids.map((id) => {
      const q = new Parse.Query(Type);

      q.equalTo('company', Company.createWithoutData(id));

      q.descending('timestamp');

      return q.find().then(forms => {
        for (let form of forms) {
          this.loader.prime(form.id, form);
        }
        return forms;
      });
    }));
  }

  get(id) {
    return this.loader.load(id);
  }

  getAll(companyId) {
    return this.allLoader.load(companyId);
  }

  getFormsByPage(id, from, to) {
    return this.formsLoader.load([ id, from, to ]);
  }

  countAll(id) {
    return this.countsLoader.load(id);
  }

  extrapolatePages(id, to) {
    return this.extrapolationsLoader.load([ id, to ]);
  }
}

