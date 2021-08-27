
import React from 'react'
import { Cell, Input, Button, Toast } from 'zarm'
import { createForm  } from 'rc-form'
import Header from '@/components/Header'
import s from './index.module.less';
import { post } from '@/utils';

const Account = (props) => {
    const { getFieldProps, getFieldError } = props.form;
    const submit = () => {
        // validateFields 获取表单属性元素
        props.form.validateFields(async (error, value) => {
          // error 表单验证全部通过，为 false，否则为 true
          if (!error) {
            console.log(value)
            if (value.newpass != value.newpass2) {
              Toast.show('新密码输入不一致');
              return
            }
            await post('/api/user/modifyPass', {
              old_pass: value.oldpass,
              new_pass: value.newpass,
              new_pass2: value.newpass2
            })
            Toast.show('修改成功')
          }
        });
      }
    return (
        <>
            <Header title="重制密码" />
            <div className={s.account}>
      <div className={s.form}>
        <Cell title="原密码">
          <Input
            clearable
            type="text"
            placeholder="请输入原密码"
            {...getFieldProps('oldpass', { rules: [{ required: true }] })}
          />
        </Cell>
        <Cell title="新密码">
          <Input
            clearable
            type="text"
            placeholder="请输入新密码"
            {...getFieldProps('newpass', { rules: [{ required: true }] })}
          />
        </Cell>
        <Cell title="确认密码">
          <Input
            clearable
            type="text"
            placeholder="请再此输入新密码确认"
            {...getFieldProps('newpass2', { rules: [{ required: true }] })}
          />
        </Cell>
      </div>
      <Button className={s.btn} block theme="primary" onClick={submit}>提交</Button>
    </div>

        </>
    )
}   

export default createForm()(Account)