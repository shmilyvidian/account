import React, { useEffect, useRef, useState } from 'react';
import Header from '@/components/Header'
import s from './index.module.less'
import cx from 'classnames'
import { get, typeMap, post } from '@/utils';
import PopupAdd from '@/components/PopupAdd';
import CustomIcon from '@/components/CustomIcon';
import { useHistory, useLocation } from 'react-router-dom';
import dayjs from 'dayjs';
import { Modal, Toast } from 'zarm';
function Detail() {
    const editRef = useRef()
    const [detail, setDetail] = useState({})
    const history = useHistory()
    const location = useLocation()
    const [,id] = (/\?id=(\d+)/g).exec(location.search)
    const getDetail = async () => {
        const { data } = await get(`/api/bill/detail?id=${id}`);
        setDetail(data);
      }
    
    useEffect(async () =>{
        getDetail()
    }, [])
    const deleteDetail = async () => {
        Modal.confirm({
            title: '删除',
            content: '确认删除账单？',
            onOk: async () => {
              const { data } = await post('/api/bill/delete', { id })
              Toast.show('删除成功')
              history.goBack()
            },
          });
    }
    return (
        <div className={s.detail}>
            <Header title="账单详情" />
            <div className={s.card}>
                <div className={s.type}>
                    {/* 通过 pay_type 属性，判断是收入或指出，给出不同的颜色*/}
                    <span className={cx({ [s.expense]: detail.pay_type == 1, [s.income]: detail.pay_type == 2 })}>
                        <CustomIcon className={s.iconfont} type={detail.type_id ? typeMap[detail.type_id].icon : 1} />
                    </span>
                    <span>{detail.type_name || ''}</span>
                </div>
                {
                    detail.pay_type == 1
                        ? <div className={cx(s.amount, s.expense)}>-{detail.amount}</div>
                        : <div className={cx(s.amount, s.incom)}>+{detail.amount}</div>
                }
                <div className={s.info}>
                    <div className={s.time}>
                        <span>记录时间</span>
                        <span>{dayjs(Number(detail.date)).format('YYYY-MM-DD HH:mm')}</span>
                    </div>
                    <div className={s.remark}>
                        <span>备注</span>
                        <span>{detail.remark || '-'}</span>
                    </div>
                </div>
                <div className={s.operation}>
                    <span onClick={deleteDetail}><CustomIcon type='shanchu' />删除</span>
                    <span onClick={() => editRef.current && editRef.current.show()}><CustomIcon type='tianjia' />编辑</span>
                </div>
            </div>
            <PopupAdd ref={editRef} detail={detail} reload={getDetail} />
        </div>
    )

}

export default Detail