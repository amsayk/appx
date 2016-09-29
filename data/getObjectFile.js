const Parse = require('parse/node');

const File = ({ id }) => Parse.Object.extend('File_' + id);

module.exports = function getObjectFile(obj, type) {
  const Type = File({ id: type === 'Logo' || type == 'Avatar' ? obj.id : obj.get('company').id, });

  const qry = new Parse.Query(Type);

  switch (type){
    case 'Avatar':

      qry.equalTo('user', obj);
      break;

    case 'Logo':

      qry.equalTo('company', obj);
      break;

  }

  qry.equalTo('type', type);

  qry.descending('createdAt');

  return qry.first();
};
