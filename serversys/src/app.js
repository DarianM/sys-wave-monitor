const express = require('express');
const cors = require('cors');

const api = require('./routes/api');

const app = express();

// use CORS middleware
let corsOptions = { 
  origin : ['http://localhost:5173', 'http://localhost:4173'], 
}

app.use(cors(corsOptions));

app.use('/', api);

module.exports = app;