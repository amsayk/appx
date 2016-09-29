import log from './log';

process.on('uncaughtException', (ex) => {
  log.error(ex);
  process.exit(1);
});

const path = require('path');

const cookie = require('react-cookie');

const React = require('react');
const ReactDOM = require('react-dom/server');

const { IntlProvider } = require('react-intl');

const intlLoader = require('./intl-loader');

const express = require('express');
// const serveStatic = require('serve-static');

const { default : createStore } = require('./store');
const { default : getRoutes } = require('./routes');

const { default : ApolloClient, createNetworkInterface, addTypename } = require('apollo-client');
const { ApolloProvider } = require('react-apollo');

const { renderToStringWithData } = require('react-apollo/server');
const { match, RouterContext } = require('react-router');

const { apolloExpress, graphiqlExpress } = require('apollo-server');

const {
  makeExecutableSchema,
} = require('graphql-tools');

const { schema: Schema, resolvers: Resolvers } = require('../data/schema');

const { CompaniesConnector } = require('../data/company/connector');
const { FormsConnector } = require('../data/forms/connector');
const { UserConnector } = require('../data/user/connector');

const { Companies } = require('../data/company/models');
const { Forms } = require('../data/forms/models');
const { Users } = require('../data/user/models');

const bodyParser = require('body-parser');

const Parse = require('parse/node');

const compression = require('compression');

const fs = require('fs');

const ua = require('express-useragent');

const cors = require('cors');
const { ParseServer } = require('parse-server');

import { locales } from 'utils/i18n';

require('moment').locale('fr', locales['fr']);

const morgan = require('morgan');

const databaseUri = process.env.DATABASE_URI || process.env.MONGOLAB_URI;
if (! databaseUri) {
  log('DATABASE_URI not specified, falling back to localhost.');
}

const __DEV__ = process.env.NODE_ENV !== 'production';

const PORT = process.env.PORT || 5000;

const server = express();

// Don't rate limit heroku
server.enable('trust proxy');

const mountPath = process.env.PARSE_MOUNT || '/parse';

const SERVER_URL = process.env.SERVER_URL || `http://localhost:${PORT}${mountPath}`;

const api = new ParseServer({
  databaseURI: databaseUri || 'mongodb://localhost:27017/appx',
  cloud: path.resolve(process.cwd(), 'backend', 'main.js'),
  appId: process.env.APPLICATION_ID,
  javascriptKey: process.env.JAVASCRIPT_KEY,
  masterKey: process.env.MASTER_KEY,
  serverURL: SERVER_URL,
  enableAnonymousUsers: typeof process.env.ANON_USERS !== 'undefined' ? process.env.ANON_USERS : false,
  allowClientClassCreation: true,
  maxUploadSize: '25mb',
});

server.use(cors());

// Serve the Parse API on the /parse URL prefix
server.use(mountPath, api);

server.use(ua.express());

__DEV__ || (process.env.SECURE && server.use(https()));

__DEV__ || server.use(compression({}));

// use morgan to log requests to the console
__DEV__ && server.use(morgan('combined', {}));

const getAssets = function () {
  let assets;

  return function () {
    if (__DEV__ || typeof assets === 'undefined') {
      const fileData = fs.readFileSync(path.resolve(process.cwd(), 'webpack-assets.json'), 'utf8');
      assets = JSON.parse(fileData);
    }

    return assets;
  };
}();

// Rendering

server.set('views', path.resolve(process.cwd(), 'public'));
server.set('view engine', 'html');

server.engine('html', require('ejs').renderFile);

server.use(
  '/assets/', express.static(path.resolve(process.cwd(), 'dist'), {
  maxAge: '180 days',
}));

// server.use(serveStatic('/assets/', {
//   maxAge: 365 * 24 * 60 * 60
// }));

const executableSchema = makeExecutableSchema({
  typeDefs: Schema,
  resolvers: Resolvers,
  allowUndefinedInResolve: false,
  logger: { log: (e) => log.error(e.stack) },
});

const companiesConnector = new CompaniesConnector();
const formsConnector = new FormsConnector();
const userConnector = new UserConnector();

server.use('/graphql', bodyParser.json(), apolloExpress(req => {
  // Get the query, the same way express-graphql does it
  // https://github.com/graphql/express-graphql/blob/3fa6e68582d6d933d37fa9e841da5d2aa39261cd/src/index.js#L257
  const query = req.query.query || req.body.query;
  if (query && query.length > 2000) {
    // None of our app's queries are this long
    // Probably indicates someone trying to send an overly expensive query
    throw new Error('Query too large.');
  }

  const token = req.headers['Session-Token'];

  function getUser() {
    const query = new Parse.Query(Parse.User);
    query.equalTo('sessionToken', token);
    return query.first().then(user => user.toJSON());
  }

  return getUser(token).then(user => ({
    schema: executableSchema,
    context: {
      user,
      Companies: new Companies({ connector: companiesConnector, user }),
      Users: new Users({ user, connector: userConnector }),
      Forms: new Forms({ connector: formsConnector, user }),
    },
    printErrors: __DEV__,
  }));
}));

__DEV__ && server.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql',
  pretty: true,
}));

const locale = 'fr';

const {messages} = intlLoader(locale);

const formats = {
  date: {
    medium: {
      style: 'medium',
    },
  },
  number: {
    MAD: {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 2,
    },
    MONEY: {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    },
    PERCENT: {
      style: 'percent',
      minimumFractionDigits: 2,
    },

  },
};

server.get([ '/', '/app', '/login' ], function (req, res) {

  switch (req.useragent.browser) {
    case 'Chrome':
    // case 'Firefox':

      if (req.useragent.isMobile) {
        // Mobile error
        res.end('Sorry, Mobile is unsupported.');
      } else {
        cookie.plugToRequest(req, res);

        const store = createStore();

        match({ routes: getRoutes(store), location: req.originalUrl }, (error, redirectLocation, renderProps) => {

          if (redirectLocation) {
            res.redirect(302, redirectLocation.pathname + redirectLocation.search);
          } else if (error) {
            console.error('ROUTER ERROR:', error); // eslint-disable-line no-console
            res.status(500);
          } else if (renderProps) {
            const client = new ApolloClient({
              ssrMode: true,
              // Remember that this is the interface the SSR server will use to connect to the
              // API server, so we need to ensure it isn't firewalled, etc
              networkInterface: createNetworkInterface(`http://localhost:${PORT}/graphql`, {
                credentials: 'same-origin',
                // transfer request headers to networkInterface so that they're accessible to proxy server
                // Addresses this issue: https://github.com/matthew-and/isomorphic-fetch/issues/83
                headers: req.headers,
              }),
              queryTransformer: addTypename,
              dataIdFromObject: ({ id, __typename }) => {
                if (id && __typename) { // eslint-disable-line no-underscore-dangle
                  return __typename + '-' +  id; // eslint-disable-line no-underscore-dangle
                }
                return null;
              },
            });

            const app = (
              <IntlProvider defaultLocale={'fr'} locale={locale} messages={messages} formats={formats}>
                <ApolloProvider client={client} store={store} immutable>
                  <RouterContext {...renderProps}/>
                </ApolloProvider>
              </IntlProvider>
            );

            renderToStringWithData(app).then(function ({ initialState : state, markup : html }) {
              res.status(200);

              res.render('index', {
                dev: __DEV__,
                assets: getAssets(),
                port: 8080,
                appState: JSON.stringify(store.getState().toJS()),
                apolloState: JSON.stringify(state),
                html,
                locale, // req.locale,
              });

            }).catch(e => log.error('RENDERING ERROR:', e)); // eslint-disable-line no-console

          } else {
            res.status(404)
              .send('Not found');
          }

        });

      }

      break;

    default:
      // Invalid user agent
      res.end('Sorry, unsupported browser. Please use Google Chrome.');
  }

});

server.listen(PORT, (err) => {

  if (err) {
    throw err;
  }

  (function () {

    Parse.Promise.when([
      Parse.Cloud.run('initialization', {}),
      Parse.Cloud.run('initUsers', {}),
    ]).then(function () {
      log.info('Server initialized.');
    }, function (err) {
      log.error('Error initialing server:', err);
      throw err;
    });

  })();

  log(
    `App is now running on http://localhost:${PORT}`
  );
});

function https() {

  function isSecure(req) {
    // Check the trivial case first.
    if (req.secure) {
      return true;
    }
    // Check if we are behind Application Request Routing (ARR).
    // This is typical for Azure.
    if (req.headers['x-arr-log-id']) {
      return typeof req.headers['x-arr-ssl'] === 'string';
    }
    // Check for forwarded protocol header.
    // This is typical for AWS.
    return req.headers['x-forwarded-proto'] === 'https';
  }

  return function (req, res, next) {
    if (isSecure(req)) {
      return next();
    }
    // Note that we do not keep the port as we are using req.hostname
    // and not req.headers.host. The port number does not really have
    // a meaning in most cloud deployments since they port forward.
    res.redirect('https://' + req.hostname + req.originalUrl);
  };
}
