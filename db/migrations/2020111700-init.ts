import Knex from 'knex';

export const up = async (knex: Knex) => {
  await knex.schema.createTable('team', (table) => {
    table.increments('id').primary();
    table.string('name').unique();
  })

  await knex.schema.createTable('round', (table) => {
    table.increments('id').primary();
    table.string('name').unique();
  })

  await knex.schema.createTable('match', (table) => {
    table.increments('id').primary();
    table.integer('team1id');
    table.integer('team2id');
    table.integer('roundid');
    table.date('date');

    table.foreign('team1id').references('team.id');
    table.foreign('team2id').references('team.id');
    table.foreign('roundid').references('round.id');
  })

  await knex.schema.createTable('score', (table) => {
    table.increments('id').primary();
    table.integer('matchid');
    table.enum('type', ['ft']);
    table.integer('team1');
    table.integer('team2');

    table.foreign('matchid').references('match.id')
  })
}

export const down = async (knex: Knex) => {
  knex.schema.dropTable('score');
  knex.schema.dropTable('match');
  knex.schema.dropTable('round');
  knex.schema.dropTable('team');
}
