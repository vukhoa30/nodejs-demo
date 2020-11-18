import Knex from 'knex';

export const up = async (knex: Knex) => {
  await knex.schema.createTable('country', (table) => {
    table.increments('id').primary();
    table.string('name').unique();
  })

  await knex.schema.createTable('club', (table) => {
    table.increments('id').primary();
    table.string('name').unique();
    table.string('code').unique();
    table.integer('countryid');
    table.foreign('countryid').references('country.id');
  })
}

export const down = async (knex: Knex) => {
  knex.schema.dropTable('club');
  knex.schema.dropTable('country');
}
