import express from 'express';
import httpGetTotalMemory from './memory.controller';

const memoryRouter = express.Router();

memoryRouter.get('/', httpGetTotalMemory);

export default memoryRouter;