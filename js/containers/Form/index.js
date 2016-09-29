import React, {} from 'react';

import ModalContainer from 'containers/ModalContainer';

import Modal from 'react-bootstrap/lib/Modal';

import { graphql, compose, } from 'react-apollo';
import gql from 'graphql-tag';

import FormWrapper from './FormWrapper';

import Dialog, { Header, Body, Footer } from 'containers/ModalContainer/Dialog';

import CSSModules from 'react-css-modules';

import styles from './Form.scss';

import update from 'react-addons-update';

import find from 'lodash.findindex';

import isEmpty from 'lodash.isempty';

function load(type, cb){
	switch (type) {

		case 'CNSS':
			return require.ensure([], function(require){
				const { default : Component, } = require('./CNSS');
				cb(Component);
			}, 'CNSS');

		case 'IR':
			return require.ensure([], function(require){
				const { default : Component, } = require('./IR');
				cb(Component);
			}, 'IR');

		case 'IS':
			return require.ensure([], function(require){
				const { default : Component, } = require('./IS');
				cb(Component);
			}, 'IS');

		case 'VAT':
			return require.ensure([], function(require){
				const { default : Component, } = require('./VAT');
				cb(Component);
			}, 'VAT');

	}
}

function getTitleAndDesignation(typ) {
	switch (typ) {
		case 'CNSS':
			return {
				title: 'Nouvelle formulaire CNSS',
				designation: 'C',
			};

		case 'IR':
			return {
				title: 'Nouvelle formulaire IR',
				designation: 'R',
			};

		case 'IS':
			return {
				title: 'Nouvelle formulaire IS',
				designation: 'S',
			};

		case 'VAT':
			return {
				title: 'Nouvelle formulaire TVA',
				designation: 'V',
			};

	}
}

class FormLoad extends React.PureComponent{
	state = {
		Component: null,
	};
	wrap(Component, props){
		return (
      <Component Wrapper={this.Wrapper} {...props}/>
		);
	}
	componentWillReceiveProps(nextProps){
		const { type, id, modalOpen, } = nextProps;
		if(type !== this.props.type || id !== this.props.id && modalOpen !== this.state.modalOpen){
			this.Wrapper = FormWrapper({
				name: type,
				...getTitleAndDesignation(type),
			});

			if(modalOpen){
				load(type, (Component) => {
					this.setState({
						Component: compose(
							withQuery,
							withChangeMutations,
							withDeleteMutations,
							withPdfMeutations
						)(Component),
					});
				});
			} else {
				this.setState({
					Component: null,
				});
			}

		}
	}
	render(){
		const { Component } = this.state;
		const { styles : theme, modalOpen, ...props, } = this.props;
		return (
			<Modal dialogClassName={theme.modal}
				dialogComponentClass={Dialog}
				show={modalOpen} keyboard={false} backdrop={false} onHide={props.actions.onClose} autoFocus enforceFocus>

				{Component && this.wrap(Component, { theme, ...props })}

			</Modal>
		);
	}
}

FormLoad = CSSModules(FormLoad, styles);

const QUERY = gql`
	query getForm($id: ID!){

		form(id: $id){
			objectId
			displayName

			type

			createdAt
			updatedAt
      timestamp
		}

	}
`;

const withQuery = graphql(QUERY, {
	options: (ownProps) => ({
		variables: {
			id: ownProps.id,
		},
		skip: typeof ownProps.id === 'undefined',
	}),
	props: ({ ownProps, data }) => {
		if (data.loading) return { loading: true, hasErrors: false, };
		if (data.error) return { hasErrors: true, loading: false, };
		return {
			initialValues: data.form || ownProps.initialValues || {},
			loading: false,
			hasErrors: false,
		};
	}
});

const CHANGE_MUTATION = gql`

	mutation addOrUpdateForm($id: ID, $type: FormType!, $companyId: ID!, $fields: [FieldValueType!]!){
		addOrUpdateForm(id: $id, type: $type, companyId: $companyId, fields: $fields) {
			form{
				objectId
				displayName

				type

				createdAt
				updatedAt
				timestamp
			}
		}
	}

`;

const ALLOW_FIELDS = [
  'displayName'
];

const withChangeMutations = graphql(CHANGE_MUTATION, {
	props: ({ ownProps, mutate, }) => {
		return {
			addOrUpdate({ fields, }) {
				return mutate({
					variables: {
						id: ownProps.id,
						type: ownProps.type,
						companyId: ownProps.company.id || ownProps.company.objectId,
            fields: fields.filter(({ fieldName }) => ALLOW_FIELDS.indexOf(fieldName) !== -1),
					},
					updateQueries: {

						getForm: (previousQueryResult, { mutationResult, }) => {
              if (! isEmpty(mutationResult.errors)) {
                return previousQueryResult;
              }
							const form = mutationResult.data.addOrUpdateForm.form;
							return update(previousQueryResult, {
								form: {
									$set: form,
								},
							});
						},

            getForms: (previousQueryResult, { mutationResult, queryVariables : vars }) => {
              if (! isEmpty(mutationResult.errors)) {
                return previousQueryResult;
              }
							const form = mutationResult.data.addOrUpdateForm.form;

              if (ownProps.id) {
                const index = find(previousQueryResult.forms, (f) => f.objectId === form.objectId);

                if (index !== -1) {
                  return update(

                    update(
                      previousQueryResult,
                      {
                        forms: {
                          $splice: [ [ index, 1 ] ]
                        }
                      }
                    ),

                    {
                      forms: {
                        $unshift: [ form ]
                      }
                    }
                  );
                }
              }

							return update(previousQueryResult, {
								forms: {
									$unshift: [ form ],
								},
							});
						},


						getAllForms: (previousQueryResult, { mutationResult, queryVariables : vars }) => {
              if (! isEmpty(mutationResult.errors)) {
                return previousQueryResult;
              }
							const form = mutationResult.data.addOrUpdateForm.form;

              if (ownProps.id) {
                const index = find(previousQueryResult.allForms, (f) => f.objectId === form.objectId);

                if (index !== -1) {
                  return update(

                    update(
                      previousQueryResult,
                      {
                        allForms: {
                          $splice: [ [ index, 1 ] ]
                        }
                      }
                    ),

                    {
                      allForms: {
                        $unshift: [ form ]
                      }
                    }
                  );
                }
              }

							return update(previousQueryResult, {
								allForms: {
									$unshift: [ form ],
								},
							});
						},

					},
				});
			}
		};
	},
});

const DELETE_MUTATION = gql`

	mutation delForm($id: ID!){
		delForm(id: $id){
			deletedFormId
		}
	}

`;

const withDeleteMutations = graphql(DELETE_MUTATION, {
	props: ({ ownProps, mutate, }) => {
		return {
			del() {
				return mutate({
					variables: { id: ownProps.id, },
					updateQueries: {

            getForm: (previousQueryResult, { mutationResult, }) => {
              if (! isEmpty(mutationResult.errors)) {
                return previousQueryResult;
              }
							// return update(previousQueryResult, {
							// 	form: {
							// 		$set: null,
							// 	},
							// });
              return {
                form: null,
              };
						},

            getForms: (previousQueryResult, { mutationResult, }) => {
              if (! isEmpty(mutationResult.errors)) {
                return previousQueryResult;
              }
              const id = mutationResult.data.delForm.deletedFormId;
              const index = find(previousQueryResult.forms, (f) => f.objectId === id);
							return index !== -1 ? update(previousQueryResult, {
								forms: {
									$splice: [ [ index, 1 ] ],
								},
							}) : previousQueryResult;
						},


            getAllForms: (previousQueryResult, { mutationResult, }) => {
              if (! isEmpty(mutationResult.errors)) {
                return previousQueryResult;
              }
							const id = mutationResult.data.delForm.deletedFormId;
              const index = find(previousQueryResult.allForms, (f) => f.objectId === id);
							return index !== -1 ? update(previousQueryResult, {
								allForms: {
									$splice: [ [ index, 1 ] ],
								},
							}) : previousQueryResult;
						},

					},
				});
			}
		};
	},
});


const PDF_MUTATION = gql`

	mutation getPdf($id: ID!){
		getFormPdf(id: $id){
			url
		}
	}

`;

const withPdfMeutations = graphql(PDF_MUTATION, {
	props: ({ ownProps, mutate, }) => {
		return {
			getPdf() {
				return mutate({
					variables: { id: ownProps.id },
				});
			}
		};
	},
});

export default ModalContainer.create('form', function (props) {
	return (
		<FormLoad {...props}/>
	);
});
