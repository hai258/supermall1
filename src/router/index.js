import Vue from 'vue'
import VueRouter from 'vue-router'
import { getToken } from '@/common/login.js'
// 1.安装插件
Vue.use(VueRouter)
const Home = () =>
    import ('../views/home/Home')
const Category = () =>
    import ('../views/category/Category')
const Cart = () =>
    import ('../views/cart/Cart')
const Profile = () =>
    import ('@/views/Profile/Profile')
const Detail = () =>
    import ('../views/detail/Detail')
const Login = () =>
    import ('@/views/Login')

// 2.创建路由对象
const routes = [{
        path: '',
        redirect: '/home'
    },
    {
        path: '/home',
        component: Home
    },
    {
        path: '/category',
        component: Category
    },
    {
        path: '/cart',
        component: Cart
    },
    {
        path: '/profile',
        component: Profile
    },
    {
        path: '/detail/:iid',
        component: Detail
    },
    {
        path: '/login',
        name: 'login',
        component: Login
    }
]
const router = new VueRouter({
    routes,
    mode: 'history',
})
router.beforeEach((to, from, next) => {
        const token = getToken()
        if (to.name === 'shopcart') {
            if (!token) {

                if (from.name !== 'login') {
                    alert("请先完成登录")
                }
                next({
                    name: 'login',
                    params: {
                        redirect: to.fullPath
                    }
                })

            } else {

                next()
            }

        } else {
            next()
        }



    })
    // 3.导出router
export default router