const { formatError, } = require('../utils');

module.exports = function(request, response){
  const { newPassword, } = request.params;

  if(!request.user){
    response.error(new Error('L\'utilisateur doit être connecté.'));
    return;
  }

  request.user.set({password: newPassword});
  request.user.save(null, { useMasterKey: true, sessionToken: request.user.getSessionToken(), }).then(function () {
    response.success({});
  }, function (error) {
    response.error(formatError(error));
  });
}
