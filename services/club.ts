import { Club, Country } from '../models';

const getClubs = async (name?: string, code?: string, offset?: number, limit?: number) => {
  const query = Club.query();
  offset = offset || 0;
  if (name) {
    query.andWhere('name', 'ilike', `%${name}%`)
  }
  if (code) {
    query.andWhere('code', '=', code);
  }
  const totalResult = await query.resultSize();
  if (limit) {
    query.limit(limit);
  }
  const rows = await query.withGraphFetched('country').offset(offset).omit(['countryid']);
  // @ts-ignore
  rows.forEach(r => r.country = r.country.name);

  return {
    total: totalResult,
    rows
  };
}

const getClub = (id: number) => Club.query().findById(id)
                                  .withGraphFetched('country').omit(['countryid']);

const upsertClub = async (modifier: any, id?: string) => {
  let query = Club.query();
  if (id) { // is update instead of create
    modifier.id = id;
  }
  if (modifier.country) {
    const country = await Country.query().where('name', '=', modifier.country.name);
    if (country.length) {
      modifier.country = country;
    }
  }
  return query.upsertGraphAndFetch(modifier, { relate: true, unrelate: true, insertMissing: true })
    .withGraphFetched('country').omit(['countryid'])
    .catch(e => console.log(e));
}

const deleteClub = (id: number) => Club.query().deleteById(id);

export { getClubs, getClub, upsertClub, deleteClub }