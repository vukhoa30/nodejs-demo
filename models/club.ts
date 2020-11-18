import { Model } from 'objection';
import { Country } from '.';

interface IClub {
  id: number;
  name: string;
  code: string;
  country: string;
}

// @ts-ignore
class Club extends Model implements IClub {
  static get tableName() {
    return 'club';
  }

  id = undefined as any;
  name = undefined as any;
  code = undefined as any;
  country = undefined as any;

  static columnNameMappers = {
    parse: (obj: any) => {
      // delete obj.countryid;
      return obj;
    },
    format: (obj: any) => {
      return obj;
    }
  }

  static get relationMappings() {
    return {
      country: {
        relation: Model.BelongsToOneRelation,
        modelClass: Country,
        join: {
          from: 'club.countryid',
          to: 'country.id'
        }
      },
    }
  }

  static query(...args: any[]) {
    return super.query(...args).onBuildKnex(knexQueryBuilder => {
      knexQueryBuilder.on('query', (queryData: any) => {
        console.log('Raw SQL query:', queryData.sql);
      });
    });
  }
}

export { Club };