import Knex from 'knex';
import dataset from '../datasets/en.1.json';

export const seed2 = async (knex: Knex) => {
}

export const seed = async (knex: Knex) => {
  for (let i = 0; i < dataset.matches.length; i++) {
    let m = dataset.matches[i];
    // inserting this way instead of using name array mapping so we can reuse it
    // when new records like the en.1.json are added
    const [team1id] = await knex('team')
      .insert({ name: m.team1 })
      .onConflict('name')
      .merge()
      .returning('id');
    const [team2id] = await knex('team')
      .insert({ name: m.team2 })
      .onConflict('name')
      .merge()
      .returning('id');
    const [roundid] = await knex('round')
      .insert({ name: m.round })
      .onConflict('name')
      .merge()
      .returning('id');
    const [matchid] = await knex('match').insert({
      team1id,
      team2id,
      roundid,
      date: m.date
    }).returning('id');
    const scoreTypes = Object.keys(m.score || {});
    if (scoreTypes.length) {
      let scores = [];
      for (let j = 0; j < scoreTypes.length; j++) {
        scores.push({
          type: scoreTypes[j],
          matchid,
          // @ts-ignore
          team1: m.score[scoreTypes[j]][0],
          // @ts-ignore
          team2: m.score[scoreTypes[j]][1],
        });
      }
      await knex('score').insert(scores);
    }
  }
};
