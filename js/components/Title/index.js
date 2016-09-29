import Title from './Title';

import { isServer } from 'utils/environment';

import emptyFunction from 'utils/emptyFunction';

export default isServer ? emptyFunction.thatReturns(null) : Title;
