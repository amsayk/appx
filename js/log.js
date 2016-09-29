import minilog from 'minilog';

let logInstance = null;

minilog.enable();
logInstance = minilog('client');
const existingErrorLogger = logInstance.error;
logInstance.error = (err) => {
  // window.Rollbar.error(err)
  existingErrorLogger(err);
};

const log = logInstance;
export default log;
