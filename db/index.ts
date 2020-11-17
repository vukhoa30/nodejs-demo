import Knex from 'knex';
import { resolve } from 'path';

import {
  DB_DIALECT, DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USERNAME, ENV
} from '../configs/env';

const createKnexClient = () => {
  return Knex({
    client: DB_DIALECT,
    connection: {
      host: DB_HOST,
      port: DB_PORT,
      user: DB_USERNAME,
      password: DB_PASSWORD,
      database: ENV === 'test' ? `test${DB_NAME}` : DB_NAME
    },
    migrations: {
      extension: ENV === 'production' ? 'js' : 'ts',
      directory: resolve(__dirname, 'migrations')
    },
    seeds: {
      directory: resolve(__dirname, 'seeds')
    }
  })
};

const migrate = async () => {
  const knex = createKnexClient();
  try {

    // delete this
    try {
      await knex.raw('drop table knex_migrations');
      await knex.raw('drop table knex_migrations_lock');
      await knex.raw('drop table if exists score')
      await knex.raw('drop table if exists match')
      await knex.raw('drop table if exists round')
      await knex.raw('drop table if exists team')
      // await knex('score').del();
      // await knex('match').del();
      // await knex('round').del();
      // await knex('team').del();
    } catch {}

    await knex.migrate.latest();


    console.log('Migration completed');
  } catch (e) {
    console.log('Error during migration:', e);
  } finally {
    knex.destroy();
  }
}

const seed = async () => {
  const knex = createKnexClient();
  try {
    await knex.seed.run();
    console.log('Seeding completed');
  } catch (e) {
    console.log('Error during seeding:', e);
  } finally {
    knex.destroy();
  }
}

export { createKnexClient, migrate, seed }
