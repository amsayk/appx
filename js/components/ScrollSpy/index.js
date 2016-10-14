import { isServer } from 'utils/environment';

import Panel from './Panel';
import _Anchor from './Anchor';

function Frag({ children }) {
  return children;
}

export default (isServer ? Frag : Panel);

export const Anchor = (isServer ? Frag : _Anchor);
