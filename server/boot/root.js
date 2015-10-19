var path = require('path');
module.exports = function(server) {
  // Install a `/` route that returns server status
  var router = server.loopback.Router();
  router.get('/', function (req, resp, next) {
      resp.sendFile(path.resolve(__dirname, '../../client/index.html'));
  });
  router.get('/home', function (req, resp, next) {
    resp.redirect("/#/" + req.url);
  });

  router.get('/home/*', function (req, resp, next) {
    resp.redirect("/#/" + req.url);
  });
  server.use(router);
};
