import Parse from 'parse/node';

Parse.initialize(
  process.env.APPLICATION_ID,
  process.env.JAVASCRIPT_KEY,
  process.env.MASTER_KEY
);

Parse.CoreManager.set(
  'REQUEST_ATTEMPT_LIMIT', 0
);

const PORT = process.env.PORT || 5000;

const mountPath = process.env.PARSE_MOUNT || '/parse';

const SERVER_URL = process.env.SERVER_URL || `http://localhost:${PORT}${mountPath}`;

Parse.serverURL = process.env.SERVER_URL;
