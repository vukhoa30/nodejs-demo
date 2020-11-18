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
  if (totalResult > 0) {
    query.withGraphFetched('country').omit(['countryid']);
  }
  const rows = await query.offset(offset);
  // @ts-ignore
  rows.forEach(r => r.country = r.country.name);

  return {
    total: totalResult,
    rows
  };
}

const getClub = async (id: number) => {
  const rslt: any = await Club.query().findById(id).withGraphFetched('country').omit(['countryid']);
  if (rslt) {
    rslt.country = rslt.country.name;
  }
  return rslt;
}


const upsertClub = async (modifier: any, id?: number) => {
  let query = Club.query();
  if (id) { // is update instead of create
    modifier.id = id;
    if (!(await Club.query().findById(id))) {
      return { id: 0 }
    }
  }
  if (modifier.country) {
    const country = await Country.query().where('name', '=', modifier.country.name);
    if (country.length) {
      modifier.country = country;
    }
  }
  const rslt: any = await query.upsertGraphAndFetch(modifier, { relate: true, unrelate: true, insertMissing: true })
    .withGraphFetched('country').omit(['countryid'])
    .catch(e => console.log(e));
  if (rslt) {
    rslt.country = rslt.country.name;
  }
  return rslt;
}

const deleteClub = (id: number) => Club.query().deleteById(id);

export { getClubs, getClub, upsertClub, deleteClub }