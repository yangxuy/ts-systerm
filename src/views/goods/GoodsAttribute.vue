<template>
    <LoadingBox :loading="loading">
        <div class="content-box">
            <div class="goods-header">
                <span class="title"><i class="el-icon-tickets"></i>数据列表</span>
                <el-button size="small" type="primary" @click="handlerAddBrand">添加品牌</el-button>
            </div>
            <div class="wx-table">
                <el-table :data="tableData">
                    <el-table-column label="编号" prop="id"></el-table-column>
                    <el-table-column label="名称" prop="name"></el-table-column>
                </el-table>
            </div>
            <div class="wx-page">
                <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="searchData.page"
                        :page-size="100"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="total">
                </el-pagination>
            </div>
        </div>
        <el-dialog :visible.async="visibleDialog">
            <el-form :model="formData">

            </el-form>
        </el-dialog>
    </LoadingBox>

</template>

<script lang="ts">
    interface Table extends Attribute {
        createTime: string;
        updateTime: string;
    }

    import {Component, Vue} from 'vue-property-decorator'
    import {goodsGetProperty} from '@/api/api';

    @Component
    export default class GoodsAttribute extends Vue {
        tableData: Table[] = [];
        total:number=0;
        loading: boolean = false;
        visibleDialog: boolean = false;
        formData: Attribute = {
            id: 0,
            name: '',
            attibutes: [],
        };
        searchData: Page<goodsSearch> = {
            page: 1,
            pageSize: 50,
            info: {
                name: ''
            }
        };

        setData() {
            this.loading = true;
            goodsGetProperty('post',this.searchData).then((res:any)=>{
                if(res.code===this.$global.HTTPS){
                    this.tableData=res.data.list;
                    this.total=res.data.total;
                }
            })
        }

        mounted() {

        }
    }
</script>

<style scoped>
    @import "goods.scss";
</style>