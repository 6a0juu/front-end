import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/table'
        },
        {
            path: '/',
            component: resolve => require(['../components/widgets/Home.vue'], resolve),
            meta: { title: '喵喵喵？' },
            children:[
                {
                    path: '/table',
                    component: resolve => require(['../components/views/BaseTable.vue'], resolve),
                    meta: { title: '基础表格' }
                }
            ]
            
        },
        {
            path: '/login',
            component: resolve => require(['../components/views/Login.vue'], resolve)
        }/*,
        {
            path: '/404',
            component: resolve => require(['../components/page/404.vue'], resolve)
        },
        {
            path: '/403',
            component: resolve => require(['../components/page/403.vue'], resolve)
        },
        {
            path: '*',
            redirect: '/404'
        }
        */
    ]
})
