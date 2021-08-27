import React, { useState, useEffect } from 'react';
import { get } from '@/utils';
import { useHistory } from 'react-router-dom';
import s from './index.module.less';
import { Button, Cell, Toast } from 'zarm';

const User = () => {
  const [user, setUser] = useState({});
  const history = useHistory();
  useEffect(() => {
    getUserInfo();
  }, []);

  // 获取用户信息
  const getUserInfo = async () => {
    const { data } = await get('/api/user/getUserInfo');
    setUser(data);
  };
  const logout = async () => {
    localStorage.removeItem('token');
    history.push('/login');
  };
  return <div className={s.user}>
    <div className={s.head}>
      <div className={s.info}>
        <span>昵称：{user.username || '--'}</span>
        <span>
          <img style={{ width: 30, height: 30, verticalAlign: '-10px' }} src="http://s.yezgea02.com/1615973630132/geqian.png" alt="" />
          <b>{user.signature || '暂无个签'}</b>
        </span>
      </div>
      <img className={s.avatar} style={{ width: 60, height: 60, borderRadius: 8 }} src={user.avatar || 'http://127.0.0.1:7002/public/upload/20210809/1628489015477.png'} alt="" />
   </div>
   <div className={s.content}>
      <Cell
        hasArrow
        title="用户信息修改"
        onClick={() => {
          history.push('/userinfo')
        }}
        icon={<img style={{ width: 20, verticalAlign: '-7px' }} src="http://s.yezgea02.com/1615974766264/gxqm.png" alt="" />}
      />
      <Cell
        hasArrow
        title="重制密码"
        onClick={() => {
          history.push('/account')
        }}
        icon={<img style={{ width: 20, verticalAlign: '-7px' }} src="http://s.yezgea02.com/1615974766264/zhaq.png" alt="" />}
      />
      <Cell
        hasArrow
        title="关于我们"
        onClick={() => history.push('/about')}
        icon={<img style={{ width: 20, verticalAlign: '-7px' }} src="http://s.yezgea02.com/1615975178434/lianxi.png" alt="" />}
      />
    </div>
    <Button className={s.logout} block theme="danger" onClick={logout}>退出登录</Button>
  </div>
}

export default User