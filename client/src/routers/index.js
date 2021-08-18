import Home from '@/views/Home'
import Statistics from '@/views/statistics'
import User from '@/views/User'
import Login from '@/views/Login'
import About from '@/views/About'
import Detail from '@/views/Detail'

const routes = [
  {
    path: "/",
    component: Home
  },
  {
    path: "/statistics",
    component: Statistics
  },
  {
    path: "/user",
    component: User
  },
  {
    path: "/login",
    component: Login
  },
  {
    path: "/about",
    component: About
  },
  {
    path: "/detail",
    component: Detail
  }
];

export default routes