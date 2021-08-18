
import React, { useState } from "react"
import { TabBar } from 'zarm';
import { useHistory } from 'react-router-dom';
import TabIcon from '@/components/CustomIcon';
import s from './navbar.module.less';

function NavBar({showNav}){
    const [activeKey, setActiveKey] = useState('/');
    const history = useHistory()

    const changeTab = (path) => {
      setActiveKey(path)
      history.push(path)
    }
    const data = [
        {path: '/', title: '账单',  icon: <TabIcon type="zhangdan" />},
        {path: '/statistics', title: '统计', icon: <TabIcon type="tongji" />},
        {path: '/user', title: '我的', icon: <TabIcon type="wode" />}
    ]
    return (
        <TabBar 
            visible={showNav} 
            className={s.tab} 
            activeKey={activeKey} 
            onChange={changeTab}
        >
          {
            data.map(item => {

                return (
                    <TabBar.Item
                    key={item.path}
                    itemKey={item.path}
                    title={item.title}
                    icon={item.icon}
                  />
                )
            })
          }
        </TabBar>
    )
}

export default NavBar