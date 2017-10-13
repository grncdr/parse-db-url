var url = require('url');

module.exports = function parseDbUrl (dbUrl) {
  if (typeof dbUrl === 'object') {
    if (dbUrl.adapter != null) return dbUrl
    else throw new Error("'adapter' is required in config objects")
  }
  var parsed = url.parse(dbUrl, true)
  if (parsed.auth) {
    var auth = parsed.auth.split(':')
    parsed.user = auth[0];
    parsed.password = auth[1];
  }
  var adapter = parsed.protocol.replace(':', '')
  var database = parsed.pathname;

  // Trim leading slash for non-sqlite3 databases
  if (adapter !== 'sqlite3' && database) {
    var database = database.substring(1)
  } else if (adapter == 'sqlite3' && database) {
    // Remove any '%20' with real spaces so the database
    // path is a true file path that the sqlite3 adapter
    // can use (i.e., /Users/jdoe/Library/Application Support/myapp/mydatabase.sqlitedb)
    // Fixes: https://github.com/grncdr/parse-db-url/issues/1
    var database = database.replace('%20', ' ')
  }

  if (parsed.port) {
    var port = parseInt(parsed.port, 10)
    if (isNaN(port)) port = void(0)
  }

  var config = {
    adapter:  adapter,
    host:     parsed.hostname,
    port:     port,
    database: database,
    user:     parsed.user,
    password: parsed.password
  }

  for (var k in parsed.query) config[k] = parsed.query[k]

  return config;
}
