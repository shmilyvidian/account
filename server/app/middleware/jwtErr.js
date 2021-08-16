'use strict';
module.exports = secret => {
  return async function jwtErr(ctx, next) {
    const token = ctx.request.header.authorization;
    let decoded;

    if (token !== null && token) {

      try {
        decoded = ctx.app.jwt.verify(token, secret);
        await next();
      } catch (err) {
        ctx.status = 200;
        ctx.body = {
          code: 401,
          msg: 'token过期',
        };
      }
    } else {
      ctx.status = 200;
      ctx.body = {
        code: 401,
        msg: 'token not existed',
      };
      return;
    }
  };
};
