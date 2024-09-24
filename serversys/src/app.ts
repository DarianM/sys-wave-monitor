import express from 'express';
import cors from 'cors';
import api from './routes/api';

const app = express();

// use CORS middleware
let corsOptions = { 
  origin : ['http://localhost:5173', 'http://localhost:8080']
}
app.use(cors(corsOptions));
app.use('/', api);

export default app;
