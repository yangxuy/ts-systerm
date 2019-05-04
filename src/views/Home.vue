<template>
    <div class="home">
        <header class="header"></header>
        <main class="main">
            <aside class="side-left">
                <el-menu router :default-active="$route.path">
                    <SideMenu v-for="item in menu" :item="item" :key="item.index"/>
                </el-menu>
            </aside>
            <aside class="side-right">
                <router-view></router-view>
            </aside>
        </main>
    </div>
</template>
<style>
    .el-menu {
        min-height: 100%;
    }
</style>
<style lang="scss" scoped>
    .home {
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;

        .header {
            height: 89px;
            width: 100%;
            background-color: cadetblue;
        }

        .main {
            flex: 1;
            display: flex;

            .side-left {
                width: 220px;
                height: 100%;
                /*background-color: #171A2F;*/
                overflow: auto;
            }

            .side-right {
                width: calc(100% - 222px);
                height: 100%;
                /*background-color: #333333;*/
            }
        }
    }
</style>
<script lang="ts">
import SideMenu from '@/components/SideMenu.vue';
import { Component, Vue } from 'vue-property-decorator';

@Component({
  components: { SideMenu }
})
export default class Home extends Vue {
  menu: any[] = [
    {
      index: '1',
      path: '/home/index',
      name: '首页',
      icon: require('@/assets/home.svg'),
      children: [],
      meta: {
        check: false,
        modify: false,
        page_id: 1
      }
    },
    {
      index: 'usermanager',
      path: '/home/user-list',
      name: '用户管理',
      icon: require('@/assets/home.svg'),
      children: [
        {
          index: 'user-list',
          path: '/home/user-list',
          name: '用户列表',
          icon: '',
          meta: {
            check: false,
            modify: false,
            page_id: 1
          }
        }
      ],
      meta: {
        check: false,
        modify: false,
        page_id: 1
      }
    },
    {
      index: 'goodsmanager',
      path: '/home/add-goods',
      name: '商品管理',
      icon: require('@/assets/home.svg'),
      meta: {
        check: false,
        modify: false,
        page_id: 1
      },
      children: [
        {
          index: 'user-list',
          path: '/home/add-goods',
          name: '添加商品',
          icon: '',
          meta: {
            check: false,
            modify: false,
            page_id: 1
          }
        },
        {
          index: 'goods-sort',
          path: '/home/sort-goods',
          name: '商品分类',
          icon: '',
          meta: {
            check: false,
            modify: false,
            page_id: 1
          }
        },
        {
          index: 'goods-brand',
          path: '/home/brand-goods',
          name: '商品品牌',
          icon: '',
          meta: {
            check: false,
            modify: false,
            page_id: 1
          }
        },
        // {
        //     index: 'goods-property',
        //     path: '/home/brand-property',
        //     name: '商品属性',
        //     icon: '',
        //     meta: {
        //         check: false,
        //         modify: false,
        //         page_id: 1
        //     }
        // },
        {
          index: 'goods-attribute',
          path: '/home/goods-attribute',
          name: '商品属性',
          icon: '',
          meta: {
            check: false,
            modify: false,
            page_id: 1
          }
        }
      ]
    }
  ];
}
</script>
