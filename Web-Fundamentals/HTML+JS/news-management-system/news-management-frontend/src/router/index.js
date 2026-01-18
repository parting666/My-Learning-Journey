import { createRouter, createWebHistory } from 'vue-router';
import NewsList from '../views/NewsList.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';

const routes = [
    { path: '/', redirect: '/news' },
    { path: '/news', name: 'NewsList', component: NewsList },
    { path: '/login', name: 'Login', component: Login },
    { path: '/register', name: 'Register', component: Register },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// 路由守卫：检查某些页面是否需要登录
router.beforeEach((to, from, next) => {
    const publicPages = ['/login', '/register'];
    const authRequired = !publicPages.includes(to.path);
    const loggedIn = localStorage.getItem('token');

    if (authRequired && !loggedIn && to.name !== 'NewsList') { // 新闻列表允许未登录查看
        return next('/login');
    }

    next();
});


export default router;