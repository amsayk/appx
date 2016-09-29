import { connectionStateChange, } from 'redux/reducers/app/actions';

export default function connectionStateChangeObserver(store) {

  function cb() {
    console.log(`[CONNECTION STATE CHANGED]: ${window.navigator.onLine}`);
    store.dispatch(connectionStateChange());
  }


  // subscribe
  window.addEventListener('online', cb, false);
  window.addEventListener('offline', cb, false);
}
