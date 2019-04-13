<template>
    <div>
        <div v-if="item.children&&item.children.length===0">
            <el-menu-item :index="item.path">
                <i v-if="item.icon" class="el-icon-menu"></i>
                {{item.name}}
            </el-menu-item>
        </div>
        <div v-else>
            <el-submenu :index="item.path">
                <template slot="title">
                    <i v-if="item.icon" class="el-icon-menu"></i>
                    {{item.name}}
                </template>
                <el-menu-item-group v-if="item.children" v-for="data in item.children" :key="data.key">
                    <SideMenu v-if="data.children&&data.children.length>0" :item="data"></SideMenu>
                    <el-menu-item v-else class="el-menu-last" :index="data.path">{{data.name}}</el-menu-item>
                </el-menu-item-group>
            </el-submenu>
        </div>
    </div>
</template>

<script>
export default {
    name: "SideMenu",
    props: {
        item: {
            type: Object,
            required: true
        }
    }
}
</script>

<style scoped>

</style>