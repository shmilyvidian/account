import React, { useCallback, useState } from 'react'
import { Cell, Input, Button, Checkbox, Toast } from 'zarm'
import CustomIcon from '@/components/CustomIcon'
import Captcha from "react-captcha-code"
import { post } from '@/utils'
import cls from 'classnames'
import s from './style.module.less'
import { useHistory, useLocation } from 'react-router-dom'
const Login = () => {
    const [type, setType] = useState('login'); //是否是登录还是注册
    const [username, setUsername] = useState(''); // 账号
    const [password, setPassword] = useState(''); // 密码
    const [verify, setVerify] = useState(''); // 验证码
    const [code, setCode] = useState(''); //
    const location = useHistory()

    const handleCaptchaChange = useCallback((value) => {
        setCode(value)
    }, [])
    const register = async () => {
        if (!username) {
            Toast.show('请输入账号')
            return
          }
          if (!password) {
            Toast.show('请输入密码')
            return
          }
          if(type === 'register'){
            if (!verify) {
                Toast.show('请输入验证码')
                return
              };
              if (verify != code) {
                Toast.show('验证码错误')
                return
              };
          }
         
          try {
            const url = type == 'register' ? '/api/user/register' : '/api/user/login'
            const {data} = await post(url, {
                username,
                password
            })
           
            if(type == 'register'){
                setType('login')
                Toast.show('注册成功');
                return
            }else{
                localStorage.setItem('token', data.token);
                Toast.show('登录成功');
                location.push('/')
                return 
            }
          }catch(e) {
              console.log(e,'e')
            Toast.show('eror');
          }
    }
    console.log(s,'auth')
    return <div className={s.auth}>
        <div className={s.head} />
        <div className={s.tab}>
            <span className={cls({ [s.avtive]: type == 'login' })} onClick={() => setType('login')}>登录</span>
            <span className={cls({ [s.avtive]: type == 'register' })} onClick={() => setType('register')}>注册</span>
        </div>
        <div className={s.form}>
            <Cell icon={<CustomIcon type="zhanghao" />}>
                <Input
                    clearable
                    type="text"
                    placeholder="请输入账号"
                    onChange={value => setUsername(value)}
                />
            </Cell>
            <Cell icon={<CustomIcon type="mima" />}>
                <Input
                    clearable
                    type="password"
                    placeholder="请输入密码"
                    onChange={(value) => setPassword(value)}
                />
            </Cell>
            {
                type == 'register' && (
                <Cell icon={<CustomIcon type="mima" />}>
                    <Input
                        clearable
                        type="text"
                        placeholder="请输入验证码"
                        onChange={(value) => setVerify(value)}
                    />
                    <Captcha charNum={4} onChange={handleCaptchaChange} />
                </Cell>                
                )
            }
            
        </div>
        <div className={s.operation}>
            {
                type === 'register' && (
                    <div className={s.agree}>
                    <Checkbox />
                    <label className="text-light">阅读并同意<a>《shmilyvidian条款》</a></label>
                </div>
                )
            }
           
            <Button block theme="primary" onClick={register}>{type === 'register' ? "注册" : "登录"}</Button>
        </div>
    </div>
}

export default Login