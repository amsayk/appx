import {
  ADD_OR_UPDATE_COMPANY,
  DELETE_COMPANY,
  ADD_OR_UPDATE_FORM,
  DELETE_FORM,
  UPDATE_PROFILE,
  CHANGE_PASSWORD,
  GENERATE_PDF,
} from './constants';

import addOrUpdateCompany from './ops/addOrUpdateCompany';
import delCompany from './ops/delCompany';

import addOrUpdateForm from './ops/addOrUpdateForm';
import delForm from './ops/delForm';

import updateProfile from './ops/updateProfile';
import changePassword from './ops/changePassword';

import genPdf from './ops/pdf/genPdf';

Parse.Cloud.define('routeOp', function (request, response) {
  const operationKey = request.params.__operationKey;
  const req = { user: request.user, params: request.params.args, };

  switch (operationKey) {
    case ADD_OR_UPDATE_COMPANY:{
      return addOrUpdateCompany(req, response);
    }
    case DELETE_COMPANY:{
      return delCompany(req, response);
    }

    case ADD_OR_UPDATE_FORM:{
      return addOrUpdateForm(req, response);
    }
    case DELETE_FORM:{
      return delForm(req, response);
    }

    case UPDATE_PROFILE:{
      return updateProfile(req, response);
    }
    case CHANGE_PASSWORD:{
      return changePassword(req, response);
    }

    case GENERATE_PDF:{
      return genPdf(req, response);
    }

    default:
      response.error(new Error('OperationNotFound', operationKey));

  }
});

Parse.Cloud.define('initialization', function (request, response) {
  response.success({});
});

Parse.Cloud.define('initUsers', function (request, response) {

  function doAdd(obj) {
    console.log(obj.displayName + ' doesn\'t exist, creating now...');

    const p = new Parse.User();

    p.set('password', 'default');
    p.set('email', obj.email);
    p.set('username', obj.username);

    p.set('displayName', obj.displayName);

    return p.signUp(null, {
      useMasterKey: true,
      success: function (user) {
        console.log('Successfully created user `', user.get('displayName'), '`');
      },
      error: function (user, err) {
        console.error('Error creating user `' + obj.displayName + '`: ', err);
      }
    });
  }

  const promises = require('../data/_User.js').results.map(function (obj) {

    const qy = new Parse.Query(Parse.User);
    qy.find({useMasterKey: true}).then(function (objects) {
      console.log('found: ', objects.map(function (o) {
        return o;
      }));
    });

    const query = new Parse.Query(Parse.User);
    query.equalTo('username', obj.username);

    return query.first({
      useMasterKey: true,
      error: function (err) {
        return doAdd(obj);
      },
      success: function (o) {
        if (!o) {
          return doAdd(obj);
        }
        return Promise.resolve(o);
      }
    });

  });

  Promise.all(promises).then(
    function () {
      response.success({});
    },
    function (err) {
      response.error(err);
    }
  );
});

