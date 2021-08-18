'use strict';
const Controller = require('egg').Controller;

class TypeController extends Controller {
  async list() {
    const { ctx } = this;
    const type_list = await ctx.service.type.list();
    ctx.body = {
      code: 200,
      msg: 'success',
      data: {
        list: type_list,
      },
    };
  }
}

module.exports = TypeController;
