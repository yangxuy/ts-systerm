import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    base: '/',
    routes: [
        {
            path: '/',
            name: 'home',
            component: () => import('./views/Home.vue'),
            children: [
                {
                    path: '/home/index',
                    name: 'index',
                    component: () => import('./views/index.vue')
                },
                {
                    path: '/home/user-list',
                    name: 'UserList',
                    component: () => import('./views/user/UserList.vue')
                },
                {
                    path: '/home/user-detail',
                    name: 'UserDetail',
                    component: () => import('./views/user/UserDetail.vue')
                },
                {
                    path: '/home/add-goods',
                    name: 'addGoods',
                    component: () => import('./views/goods/AddGoods.vue')
                },
                {
                    path: '/home/sort-goods',
                    name: 'SortGoods',
                    component: () => import('./views/goods/GoodsSort.vue')
                },
                {
                    path: '/home/brand-goods',
                    name: 'BrandGoods',
                    component: () => import('./views/goods/GoodsBrand.vue')
                },
                {
                    path: '/home/goods-property',
                    name: 'GoodsProperty',
                    component: () => import('./views/goods/GoodsProperty.vue')
                },
                {
                    path: '/home/goods-attribute',
                    name: 'GoodsAttribute',
                    component: () => import('./views/goods/GoodsAttribute.vue')
                }
            ]
        }
    ]
});
