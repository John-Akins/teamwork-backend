"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _http = _interopRequireDefault(require("http"));

var _app = _interopRequireDefault(require("./app"));

var _dotenv = _interopRequireDefault(require("dotenv"));

// import Node native http package
_dotenv["default"].config(); // returns a valid port 
// whether port is passed as number or a string


var normalizePort = function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }

  if (port >= 0) {
    return port;
  }

  return false;
};

var port = normalizePort(process.env.PORT || "8080");

_app["default"].set("port", port); // checks for various errors and handles them appropriately, 
// also registers them to the server


var errorHandler = function errorHandler(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  var address = server.address();
  var bind = typeof address === "string" ? "pipe " + address : "port: " + port;

  switch (error.code) {
    case "EACCES":
      console.error(bind + "requires elevated priviledges.");
      process.exit(1);
      break;

    case "EADDRINUSE":
      console.error(bind + "is already in use.");
      process.exit(1);
      break;

    default:
      throw error;
  }
};

var server = _http["default"].createServer(_app["default"]);

server.on("error", errorHandler);
server.on("listening", function () {
  var address = server.address();
  var bind = typeof address === "string" ? "pipe " + address : "port " + port;
  console.log("Listening on " + bind);
}); //set server to listen with either production or local port

server.listen(port);
//# sourceMappingURL=server.js.map