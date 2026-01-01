// enviroment variables
const path = require('path');
const fs = require('fs');
// Try .env in current directory first (development), then parent directory (production build)
const envPath = fs.existsSync(path.join(__dirname, '.env'))
  ? path.join(__dirname, '.env')
  : path.join(__dirname, '..', '.env');
require('dotenv').config({ path: envPath });
const { env } = require("./src/_helper/env");
const port = env('port', 3001);
const origin = JSON.parse(env('origins', '["http://localhost:3000", "http://localhost:3002"]'))

// imports
const express = require("express");
const http = require("http");
const cors = require('cors');
require('./src/_helper/db'); // Initialize database connection

const app = express();
app.use(express.json()); // Parse JSON request bodies
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