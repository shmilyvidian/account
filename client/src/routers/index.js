import Home from '@/views/Home'
import Bill from '@/views/Bill'
import User from '@/views/User'
import Login from '@/views/Login';

const routes = [
  {
    path: "/",
    component: Home
  },
  {
    path: "/bill",
    component: Bill
  },
  {
    path: "/user",
    component: User
  },
  {
    path: "/login",
    component: Login
  }
];

export default routes