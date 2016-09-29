import React, {} from 'react';
import { render } from 'react-dom';

import Account from 'containers/Account';
import Company from 'containers/Company';

import PdfViewer from 'components/PdfViewer';

import Form from 'containers/Form';

import { ApolloProvider as Provider } from 'react-apollo';

const config = {
  account: Account,
  company: Company,
  pdfViewer: PdfViewer,
  form: Form,
};

export default class ModalController{
  static init() {
    const { store } = require('redux/store');
    const { client : apolloClient } = require('apollo');

    const { IntlProvider, intlShape, defineMessages } = require('react-intl');

    const { default : loadIntl } = require('utils/intl-loader');

    const locale = window.__locale;

    loadIntl(locale).then(({ messages }) => {

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

      Object.keys(config).forEach(function (key) {
        const Component = config[key];

        const el = document.createElement('div');

        el.id = key;

        document.body.appendChild(el);

        render(
          <IntlProvider defaultLocale={'fr'} locale={locale} messages={messages} formats={formats}>
            <Provider client={apolloClient} store={store} immutable>
              <Component/>
            </Provider>
          </IntlProvider>,

          el
        );
      });

    });

  }
};
