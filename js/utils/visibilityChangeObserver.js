import { logout } from 'redux/reducers/user/actions';

export default function doSetupVisibilityChangeObserver(store) {
  let timeout = null;

  function logOut() {
    if (timeout) {
      window.clearTimeout(timeout);
      timeout = null;
    }

    store.dispatch(logout());
  }

  function cb() {
    console.log(`[VISIBILITY CHANGED]: ${document.visibilityState}`);

    // fires when user switches tabs, apps, goes to homescreen, etc.
    if (document.visibilityState === 'hidden') {
      timeout = window.setTimeout(logOut, /* 10 minutes */10 * 60 * 1000);
    }

    // fires when app transitions from prerender, user returns to the app / tab.
    if (document.visibilityState === 'visible') {
      if (timeout) {
        window.clearTimeout(timeout);
        timeout = null;
      }
    }

  }


  cb();

  // subscribe to visibility change events
  document.addEventListener('visibilitychange', cb);
}
