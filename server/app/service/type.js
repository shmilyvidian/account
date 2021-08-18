'use strict';

const Service = require('egg').Service;

class TypeService extends Service {
  async list() {
    const { app } = this;
    try {
      const sql = 'select * from type';

      const result = await app.mysql.query(sql);
      return result;
    } catch (e) {
      console.error(e);
    }

  }
}

module.exports = TypeService;
