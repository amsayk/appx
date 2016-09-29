import {
  OPEN_MODAL,
  CLOSE_MODAL,
} from './constants';

export function open(key, state = {}){
  return {
    type: OPEN_MODAL,
    key,
    state,
  };
}

export function close(key){
  return {
    type: CLOSE_MODAL,
    key,
  };
}
