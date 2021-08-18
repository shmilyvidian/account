import React from 'react';
import { useHistory } from 'react-router-dom';
import { Icon, NavBar } from 'zarm'
import s from './index.module.less';

function Header({title}){
    const history = useHistory()
    return (
        <div className={s.headerWrap}>
            <div className={s.container}>
                <NavBar
                    className={s.header}
                    left={<Icon type="arrow-left" theme="primary" onClick={() => history.goBack()} />}
                    title={title}
                />
            </div>
        </div>
    )
}

export default Header
