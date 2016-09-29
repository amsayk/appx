const DataLoader = require('dataloader');

const Parse = require('parse/node');

const Type = Parse.Object.extend('Company');

class CompaniesConnector {
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

  getAll() {
    const q = new Parse.Query(Type);
    return q.find();
  }
}

module.exports = { CompaniesConnector, };
