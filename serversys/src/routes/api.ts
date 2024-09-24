import memoryRouter from './memory/memory.router';
import express from 'express';

const api = express.Router();
api.use('/memory', memoryRouter);

export default api;