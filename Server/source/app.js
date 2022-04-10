'use strict'

import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';

//middleware
import mw from './middleware.js';
// routes 
import routes from './routes/index.js';

// Set up the express app
const app = express();

app.use(morgan('tiny'));
// Parse incoming requests data (https://github.com/expressjs/body-parser)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

// Require our routes into the application.
app.use(routes);
app.get('*', (req, res) => res.status(404).send({
  message: 'Not found',
}));
// error handling middleware
app.use(mw.logErrors);
app.use(mw.clientErrorHandler);

export default app;

