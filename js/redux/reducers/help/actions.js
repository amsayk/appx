import {
  HELP_SKIPPED,
  STEP_COMPLETED,
} from './constants';

export function helpSkipped(){
  return {
    type: HELP_SKIPPED,
  };
}


export function stepCompleted(id){
  return {
    type: STEP_COMPLETED,
    id,
  };
}
