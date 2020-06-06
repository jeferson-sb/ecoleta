import knex from '../database/connection';

export default class ItemsService {
  static async selectAll() {
    try {
      const items = await knex('items').select('*');
      return items;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
