const express = require('express');

const {
  httpGetTotalMemory,
} = require('./memory.controller');

const memoryRouter = express.Router();

memoryRouter.get('/', httpGetTotalMemory);

module.exports = memoryRouter;