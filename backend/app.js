// enviroment variables
require('dotenv').config({ path: __dirname + '/.env' });
const { env } = require("./src/_helper/env");
const port = env('port', 3001);
const origin = JSON.parse(env('origins', '["http://localhost:3000", "http://localhost:3002"]'))

// imports
const express = require("express");
const http = require("http");
const cors = require('cors');

const app = express();
app.use(cors({ origin, credentials: true }));
app.use('/', require('./src/routes'));
app.use((req, res, next) => {
  console.log('Received request:', req.method, req.url);
  next();
});

const server = http.createServer(app);
server.listen(port, () => {
  console.log(`listening on port ${port}`);
})