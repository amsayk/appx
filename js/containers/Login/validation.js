import memoize from 'lru-memoize';
import { createValidator, } from 'utils/validation';

const validation = createValidator({
});
export default memoize(10)(validation);
