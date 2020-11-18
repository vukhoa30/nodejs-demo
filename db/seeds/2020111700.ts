import Knex from 'knex';
import dataset from '../datasets/en.1.clubs.json';

export const seed2 = async (knex: Knex) => {
}

export const seed = async (knex: Knex) => {
  for (let i = 0; i < dataset.clubs.length; i++) {
    let c = dataset.clubs[i];
    // inserting this way instead of using name array mapping so we can reuse it
    // when new records like the en.1.json are added
    const [countryid] = await knex('country')
      .insert({ name: c.country })
      .onConflict('name')
      .merge()
      .returning('id');
    await knex('club').insert({
      countryid,
      name: c.name,
      code: c.code
    })
  }
};
