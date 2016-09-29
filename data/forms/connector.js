const DataLoader = require('dataloader');

const Parse = require('parse/node');

const Type = Parse.Object.extend('Form');
const Company = Parse.Object.extend('Company');

class FormsConnector {
  constructor() {
    this.loader = new DataLoader(this.fetch.bind(this), {
    });
  }
  fetch(ids) {
    return Promise.all(ids.map((id) => {
      const q = new Parse.Query(Type);
      return q.get(id);
    }));
  }

  get(id) {
    return this.loader.load(id);
  }

  getAllPage(companyId, { offset : timestamp, limit }) {
    const q = new Parse.Query(Type);

    q.equalTo('company', Company.createWithoutData(companyId));

    if (offset) {
      q.lessThan('timestamp', timestamp);
    }

    if (limit) {
      q.limit(limit);
    }

    q.descending('timestamp');

    return q.find();
  }


  getAll(companyId) {
    const q = new Parse.Query(Type);

    q.equalTo('company', Company.createWithoutData(companyId));

    q.descending('timestamp');

    return q.find();
  }
}

module.exports = { FormsConnector, };
