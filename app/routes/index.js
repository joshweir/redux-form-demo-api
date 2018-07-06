const formRoutes = require('./form_routes');
module.exports = function(app, db) {
  formRoutes(app, db);
};
