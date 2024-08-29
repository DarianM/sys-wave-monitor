const express = require('express');

const memoryRouter = require('./memory/memory.router');

const api = express.Router();

api.use('/memory', memoryRouter);

module.exports = api;