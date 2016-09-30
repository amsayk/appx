import { formatError } from '../utils';

export default function(request, response){
  const { displayName, email, } = request.params;

  if(!request.user){
    response.error(new Error('L\'utilisateur doit être connecté.'));
    return;
  }

  request.user.set({ displayName, email, username: email, });
  request.user.save(null, { useMasterKey: true, sessionToken: request.user.getSessionToken(), }).then(function () {
    response.success({});
  }, function (error) {
    response.error(formatError(error));
  });
}
