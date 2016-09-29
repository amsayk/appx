import { RESIZE, CONNECTION_STATE_CHANGE } from './constants';

export function resize() {
  return {
    type: RESIZE,
  }
}

export function connectionStateChange() {
  return {
    type: CONNECTION_STATE_CHANGE,
  }
}
