import 'parse-config';

import React, {} from 'react';
import {render} from 'react-dom';

import getCurrentUser from './utils/getCurrentUser';

import {
  match,
  Router,
} from 'react-router';

import doSetupVisibilityChangeObserver from './utils/visibilityChangeObserver';
import doSetupConnectionStateChangeObserver from './utils/connectionStateChangeObserver';

import getRoutes from './routes';

import {createNotificationController} from 'components/Snackbar';

import Confirm from 'components/confirm/component';

import { ApolloProvider } from 'react-apollo';

import { Provider } from 'react-redux';

import { store, history } from 'redux/store';

import moment from 'moment';
import momentLocalizer from 'react-widgets/lib/localizers/moment';

// import 'react-widgets/lib/less/react-widgets.less';

import { IntlProvider, intlShape, defineMessages } from 'react-intl';

import intlLoader from 'utils/intl-loader';

import { locales } from 'utils/i18n';

import { client as apolloClient } from 'apollo';

import errorCatcher from 'error-catcher';

window.onerror = (msg, file, line, col, error) => { errorCatcher(error) }
window.addEventListener('unhandledrejection', (event) => { errorCatcher(event.reason) })

function trackPageView() {
}

window.notificationMgr = createNotificationController(store);

(async function () {
  const locale = window.__locale;

  const {messages,} = await intlLoader(locale);

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

  moment.locale(locale, locales[locale]);
  momentLocalizer(moment);

  const routes = getRoutes(store);

  class Application extends React.Component {
    static childContextTypes = {
      notificationMgr: React.PropTypes.shape({
        notify: React.PropTypes.func.isRequired,
        dismiss: React.PropTypes.func.isRequired,
      }).isRequired,
    };
    getChildContext(){
      return {
        notificationMgr: window.notificationMgr,
      };
    }
    render() {
      const { routerProps } = this.props;
      return (
        <IntlProvider defaultLocale={'fr'} locale={locale} messages={messages} formats={formats}>

          <ApolloProvider store={store} client={apolloClient} immutable>

            <Router onUpdate={trackPageView} {...routerProps}/>

          </ApolloProvider>

        </IntlProvider>
      );
    }
  }

  const mountNode = document.getElementById('app');

  match({ history, routes }, (error, redirectLocation, renderProps) => {
    render(
      <Application routerProps={renderProps}/>, mountNode
    );
  });

  const Confirmation = function () {

    const messages = defineMessages({
      Title: {
        id: 'confirmation.title',
        defaultMessage: 'Confirmation',
      },
      Yes: {
        id: 'confirmation.yes',
        defaultMessage: 'Oui',
      },
      Cancel: {
        id: 'confirmation.cancel',
        defaultMessage: 'Non',
      },
    });

    return class extends React.Component {
      static contextTypes = {
        intl: intlShape.isRequired,
      };

      render() {
        const {intl,} = this.context;
        return (
          <Confirm
            title={intl.formatMessage(messages['Title'])}
            sure={intl.formatMessage(messages['Yes'])} cancel={intl.formatMessage(messages['Cancel'])}
          />
        );
      }
    };
  }();

  render(
    <IntlProvider defaultLocale={'fr'} locale={locale}
      messages={{'confirmation.title': messages['confirmation.title'], 'confirmation.yes': messages['confirmation.yes'], 'confirmation.cancel': messages['confirmation.cancel'], }}>
      <Confirmation/>
    </IntlProvider>,

    document.getElementById('confirmation')
  );

  render(
    <Provider store={store}>
      {notificationMgr.render()}
    </Provider>,
    document.getElementById('notification')
  );

})();

if (process.env.NODE_ENV === 'production') {

  doSetupVisibilityChangeObserver(store);
  doSetupConnectionStateChangeObserver(store);

  const currentUserId = function () {
    const user = getCurrentUser();
    return user ? user.id : null;
  }();

  const gaTrackingID = process.env.GA_TRACKING_CODE;

  ga('create', gaTrackingID, 'auto', {
    userId: currentUserId,
  });

  ga('set', 'dimension1', currentUserId);

  function trackPageView() {
    const { default : getPage, } = require('utils/getPage');
    ga('send', 'pageview', getPage(window.location.pathname));
  }

  require('offline-plugin/runtime').install({
    onInstalled: function () {
      console.log('[SW]: App is ready for offline usage');
    },
    onUpdating: function () {

    },
    onUpdateReady: function () {
      require('offline-plugin/runtime').applyUpdate();
    },
    onUpdateFailed: function () {

    },
    onUpdated: function () {

    },

  });
} else {
  window.reduxStore = store;
  window.Parse = require('parse');
  window.Perf = require('react-addons-perf');

  window[`ga-disable-${process.env.GA_TRACKING_CODE}`] = true;

  require('./showDevTools').default(store);
}


