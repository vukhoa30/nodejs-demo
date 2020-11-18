import { Model } from 'objection';
import { ENV } from '../configs/env';

interface ICountry {
  id: number;
  name: string;
}

// @ts-ignore
class Country extends Model implements ICountry {
  static get tableName() {
    return 'country';
  }

  id = undefined as any;
  name = undefined as any;

  static query(...args: any[]) {
    return super.query(...args).onBuildKnex(knexQueryBuilder => {
      knexQueryBuilder.on('query', (queryData: any) => {
        if (ENV !== 'test') {
          console.log('Raw SQL query:', queryData.sql);
        }
      });
    });
  }
}

export { Country };