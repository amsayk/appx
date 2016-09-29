import {
  FILTER_OPS,
} from './constants';

export function filterOps(query){
  return {
    type: FILTER_OPS,
    filterText: query,
  };
}
