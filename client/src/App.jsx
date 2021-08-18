import React, { useState } from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useLocation
} from "react-router-dom"
import routes from '@/routers'
import logo from './logo.svg'
import { ConfigProvider } from 'zarm';
import './App.css'
import NavBar from './components/NavBar';

function App() {
  const location = useLocation()

  const { pathname } = location // 获取当前路径

  const needNav = ['/', '/statistics', '/user'] 
  const [showNav, setShowNav] = useState(false)
  useState(() => {
    console.log('      needNav.includes(pathname)    ',      needNav.includes(pathname)    )
    setShowNav(
      needNav.includes(pathname)
    )
  }, [pathname])
  return (
    <>
      <ConfigProvider primaryColor={'#007fff'}>
        <Switch>
          {
            routes.map(route => <Route exact key={route.path} path={route.path}>
              <route.component />
            </Route>)
          }
        </Switch>
      </ConfigProvider>
      <NavBar showNav={showNav} />
    </>
  )
}

export default App
