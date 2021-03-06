'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
  async register() {
    const { ctx } = this;
    const { username, password } = ctx.request.body;
    if (!username || !password) {
      ctx.body = {
        code: 500,
        msg: 'Invalid username or password',
        data: null,
      };
      return;
    }
    const userInfo = await ctx.service.user.getUserByName(username); // 获取用户信息

    if (userInfo && userInfo.id) {
      ctx.body = {
        code: 500,
        msg: '账户名已被注册，请重新输入',
        data: null,
      };
      return;
    }
    const defaultAvatar = 'http://s.yezgea02.com/1615973940679/WeChat77d6d2ac093e247c361f0b8a7aeb6c2a.png';
    // 调用 service 方法，将数据存入数据库。
    const result = await ctx.service.user.register({
      username,
      password,
      ctime: Date.now(),
      signature: '世界和平。',
      avatar: defaultAvatar,
    });

    if (result) {
      ctx.body = {
        code: 200,
        msg: '注册成功',
        data: null,
      };
    } else {
      ctx.body = {
        code: 500,
        msg: '注册失败',
        data: null,
      };
    }
  }

  async login() {
    const { ctx, app } = this;
    const { username, password } = ctx.request.body;

    const userInfo = await ctx.service.user.getUserByName(username);
    if (!userInfo || !userInfo.id) {
      ctx.body = {
        code: 500,
        msg: 'account not exits',
        data: null,
      };
      return;
    }
    if (userInfo && userInfo.password !== password) {
      ctx.body = {
        code: 500,
        msg: 'Invalid username or password',
        data: null,
      };
      return;
    }

    const token = app.jwt.sign({
      id: userInfo.id,
      username: userInfo.username,
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60),
    }, app.config.jwt.secret);

    ctx.body = {
      msg: 'success login',
      code: 200,
      data: {
        token,
      },
    };
  }
  async getUserInfo() {
    const { ctx, app } = this;
    const token = ctx.request.header.authorization;
    const decode = await app.jwt.verify(token, app.config.jwt.secret);
    const userInfo = await ctx.service.user.getUserByName(decode.username);
    ctx.body = {
      code: 200,
      message: 'success',
      data: {
        id: userInfo.id,
        username: userInfo.username,
        signature: userInfo.signature,
        avatar: userInfo.avatar,
      },
    };
  }

  async editUserInfo() {
    const { ctx, app } = this;
    const token = ctx.request.header.authorization;
    const decode = await app.jwt.verify(token, app.config.jwt.secret);
    if (!decode) return;

    const userInfo = await ctx.service.user.getUserByName(decode.username);

    const { signature, avatar = userInfo.avatar } = ctx.request.body;
    const result = await ctx.service.user.editUser({ ...userInfo, signature, avatar });
    ctx.body = {
      code: 200,
      msg: 'success',
      data: {
        id: userInfo.id,
        username: userInfo.username,
        signature,
        avatar,
      },
    };
  }

  async modifyPass() {
    const { ctx, app } = this;
    const { old_pass = '', new_pass = '', new_pass2 = '' } = ctx.request.body;

    try {
      let user_id;
      const token = ctx.request.header.authorization;
      const decode = await app.jwt.verify(token, app.config.jwt.secret);
      if (!decode) return;
      if (decode.username == 'admin') {
        ctx.body = {
          code: 400,
          msg: '管理员账户，不允许修改密码！',
          data: null,
        };
        return;
      }
      user_id = decode.id;
      const userInfo = await ctx.service.user.getUserByName(decode.username);

      if (old_pass != userInfo.password) {
        ctx.body = {
          code: 400,
          msg: '原密码错误',
          data: null,
        };
        return;
      }

      if (new_pass != new_pass2) {
        ctx.body = {
          code: 400,
          msg: '新密码不一致',
          data: null,
        };
        return;
      }

      const result = await ctx.service.user.modifyPass({
        ...userInfo,
        password: new_pass,
      });

      ctx.body = {
        code: 200,
        msg: '请求成功',
        data: null,
      };
    } catch (error) {
      ctx.body = {
        code: 500,
        msg: '系统错误',
        data: null,
      };
    }
  }
}

module.exports = UserController;
