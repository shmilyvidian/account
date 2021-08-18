import React from 'react'
import { useHistory } from 'react-router-dom'
import { Icon, NavBar } from 'zarm'
import s from './index.module.less'
import Header from '@/components/Header'
function About(){
    return (
        <div className="about">
           <Header title="关于我们" />
            <div className={s.content}>
                <h2>关于作者</h2>
                <article>
                这个项目的初衷，是想让从事前端开发的同学，进入全栈开发的领域。当然，不能说学完本教程你就能胜任任何全栈开发。但至少，你已经可以从设计数据库表开始，把自己的一个想法转化成实际可见的项目。
                </article>
            </div>
        </div>
    )
}

export default About