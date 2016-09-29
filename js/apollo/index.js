import ApolloClient, { addQueryMerging,  addTypename, } from 'apollo-client';

import getCurrentUser from 'utils/getCurrentUser';

import isEmpty from 'lodash.isempty';

import ResponseMiddlewareNetworkInterface from './response-middleware-network-interface';
import log from 'log';

const responseMiddlewareNetworkInterface = new ResponseMiddlewareNetworkInterface(process.env.GRAPHQL_ENDPOINT, {
  credentials: 'same-origin',
});

// Sample error handling middleware
responseMiddlewareNetworkInterface.use({
  applyMiddleware(req, next) {
    if (!req.options.headers) {
      req.options.headers = {};  // Create the header object if needed.
    }

    const user = getCurrentUser();
    if (! isEmpty(user)) {
      req.options.headers['Session-Token'] = user.getSessionToken();
    }
    next();
  },
  applyResponseMiddleware: (response, next) => {
    if (response.errors) {
      if (typeof window !== 'undefined') {
        log.error(JSON.stringify(response.errors))
        alert(`There was an error in your GraphQL request: ${response.errors[0].message}`)
      }
    }
    next()
  }
})

const networkInterface = addQueryMerging(responseMiddlewareNetworkInterface);

export const client = new ApolloClient({
  initialState: window.__APOLLO_STATE__,
  ssrForceFetchDelay: 100,
  networkInterface,
  shouldBatch: true,
  queryTransformer: addTypename,
  dataIdFromObject: ({ id, __typename }) => {
    if (id && __typename) { // eslint-disable-line no-underscore-dangle
      return __typename + '-' +  id; // eslint-disable-line no-underscore-dangle
    }
    return null;
  }
});

