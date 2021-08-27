import React, { forwardRef, useEffect, useRef, useState } from "react";
import { Icon, Popup, Keyboard, Input, Toast } from "zarm";
import s from './index.module.less'
import cx from 'classnames'
import dayjs from 'dayjs'
import PopupDate from '../PopupDate'
import { get, post, typeMap } from '@/utils' // Pull 组件需要的一些常量
import CustomIcon from "../CustomIcon";


const PopupAdd = forwardRef(({ detail = {}, reload }, ref) => {
    const id = (detail && detail.id) || '' // 外部传进来的账单详情 id
    const [show, setShow] = useState(false)
    const [amount, setAmount] = useState('')
    const [payType, changeType] = useState('expense')
    const [date, setDate] = useState(new Date()); // 日期
    const [showRemark, setShowRemark] = useState()
    const [remark, setRemark] = useState()
    const [currentType, setCurrentType] = useState({});

    const [expense, setExpense] = useState([])
    const [income, setIncome] = useState([])

    const dateRef = useRef()
    useEffect(() => {
        if (id) {
            setAmount(detail.amount)
            changeType(detail.pay_type === 1 ? 'expense' : 'income');
            setCurrentType({
                id: detail.type_id,
                name: detail.type_name
            });
            setRemark(detail.remark)
            setDate(dayjs(Number(detail.date)).$d)
        }
    }, [detail])
    useEffect(async () => {
        const { data: { list } } = await get('/api/type/list');
        const _expense = list.filter(i => i.type == 1); // 支出类型
        const _income = list.filter(i => i.type == 2); // 收入类型
        setExpense(_expense);
        setIncome(_income);
        // 没有 id 的情况下，说明是新建账单。
        if (!id) {
            setCurrentType(_expense[0]);
        };

    }, []);
    if (ref) {
        ref.current = {
            show: () => {
                setShow(true)
            },
            close: () => {
                setShow(false)
            }
        }
    };
    const selectMonth = (time) => {
        setDate(time)
    }
    const handleDatePop = () => {
        toggleDate()
    }
    // 添加账单弹窗
    const toggleDate = () => {
        dateRef.current && dateRef.current.show()
    };
    const handleMoney = (value) => {
        console.log(value, 'value');
        value = String(value)
        // 点击是删除按钮时
        if (value === 'delete') {
            let _amount = amount.slice(0, amount.length - 1)
            setAmount(_amount)
            return false
        }
        // 点击确认按钮时
        if (value == 'ok') {
            addBill()
            return
        }

        // 当输入的值为 '.' 且 已经存在 '.'，则不让其继续字符串相加。
        if (value == '.' && amount.includes('.')) return
        // 小数点后保留两位，当超过两位时，不让其字符串继续相加。
        if (value != '.' && amount.includes('.') && amount && amount.split('.')[1].length >= 2) return
        // amount += value
        setAmount(amount + value)
    }
    // 选择账单类型
    const choseType = (item) => {
        setCurrentType(item)
    }
    const addBill = async () => {
        let params = {
            amount: Number(amount).toFixed(2),
            type_id: currentType.id,
            type_name: currentType.name,
            date: dayjs(date).unix() * 1000,
            pay_type: payType === 'expense' ? 1 : 2,
            remark
        }
        const url = id ? "/api/bill/update" : "/api/bill/add"
        params = id ? { ...params, id } : params
        const res = await post(url, params)
        setAmount('');
        changeType('expense');
        setCurrentType(expense[0]);
        setDate(new Date());
        setRemark('');
        Toast.show(`${id ? '编辑' : '添加'}成功`);
        if (reload) {
            reload()
        }
        setShow(false)
    }
    return (
        <Popup
            visible={show}
            direction="bottom"
            onMaskClick={() => setShow(false)}
            destroy={false}
            mountContainer={() => document.body}
        >
            <div className={s.addWrap}>
                <header className={s.header}>
                    <span className={s.close} onClick={() => setShow(false)}><Icon type="wrong" /></span>
                </header>
                <div className={s.filter}>
                    <div className={s.type}>
                        <span onClick={() => changeType('expense')} className={cx({ [s.expense]: true, [s.active]: payType == 'expense' })}>支出</span>
                        <span onClick={() => changeType('income')} className={cx({ [s.income]: true, [s.active]: payType == 'income' })}>收入</span>
                    </div>
                    <div className={s.time} onClick={handleDatePop}>{dayjs(date).format('MM-DD')} <Icon className={s.arrow} type="arrow-bottom" /></div>
                </div>
                <div className={s.money}>
                    <span className={s.sufix}>¥</span>
                    <span className={cx(s.amount, s.animation)}>{amount}</span>
                </div>
                <div className={s.typeWarp}>
                    <div className={s.typeBody}>
                        {
                            (payType == 'expense' ? expense : income).map(item => <div onClick={() => choseType(item)} key={item.id} className={s.typeItem}>
                                <span className={cx({ [s.iconfontWrap]: true, [s.expense]: payType == 'expense', [s.income]: payType == 'income', [s.active]: currentType.id == item.id })}>
                                    <CustomIcon className={s.iconfont} type={typeMap[item.id].icon} />
                                </span>
                                <span>{item.name}</span>
                            </div>)
                        }
                    </div>
                </div>
                <div className={s.remark}>
                    {
                        showRemark ? <Input
                            autoHeight
                            showLength
                            maxLength={50}
                            type="text"
                            rows={3}
                            value={remark}
                            placeholder="请输入备注信息"
                            onChange={(val) => setRemark(val)}
                            onBlur={() => setShowRemark(false)}
                        /> : <span onClick={() => setShowRemark(true)}>{remark || '添加备注'}</span>
                    }
                </div>

            </div>
            <Keyboard type="price" onKeyClick={(value) => handleMoney(value)} />
            <PopupDate
                ref={dateRef}
                onSelect={selectMonth}
            />
        </Popup>)

})

export default PopupAdd;