import express from 'express';
import cors from 'cors';
import { Model } from 'objection';

import routes from './routes';
import { APP_PORT } from './configs/env';
import { createKnexClient, migrate, seed } from './db';

(async () => {
  try {
    const knex = createKnexClient();
    await migrate();
    await seed();
    Model.knex(knex);
  } catch (e) {
    console.log('Error migrating DB:', e)
  }
})();

// Middlewares
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS
app.use(cors());

// Todo: add API documentation here
app.get('/', (req, res) => {
  res.end('Welcome to Football NodeJS API Demo App')
})

// Routes
app.use("/api", routes);

// Starting the App
app.listen(APP_PORT, () => { console.log(`Listening on port: ${APP_PORT}`) });