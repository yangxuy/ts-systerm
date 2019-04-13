<template>
    <LoadingBox :loading="loading">
        <div class="content-box">
            <div class="goods-header">
                <span class="title"><i class="el-icon-tickets"></i>数据列表</span>
                <div class="search-box">
                    <el-input class="search-input" placeholder="名称搜索" v-model="searchData.info.name"></el-input>
                    <el-date-picker class="search-input" v-model="searchData.info.beginDate" placeholder="开始时间"
                                    value-format="yyyy-MM-dd HH:mm:ss" type="datetime">
                    </el-date-picker>
                    <el-date-picker class="search-input" v-model="searchData.info.endDate" placeholder="结束是假"
                                    value-format="yyyy-MM-dd HH:mm:ss" type="datetime">
                    </el-date-picker>
                    <el-button type="primary" @click="handlerSearch">搜索</el-button>
                </div>
                <el-button size="small" type="primary" @click="handlerAddGoods">添加商品</el-button>
            </div>
            <div class="wx-table">
                <el-table border :data="tableData">
                    <el-table-column label="编号" prop="id"></el-table-column>
                    <el-table-column align="center" label="商品名称" prop="name"></el-table-column>
                    <el-table-column align="center" label="商品类型" prop="typeId">
                        <template slot-scope="scope">
                            {{scope.row.typeId|filterIdToName(sortType)}}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="所属品牌">
                        <template slot-scope="scope">
                            {{scope.row.brandId|filterIdToName(brandType)}}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="副标题" prop="subHead"></el-table-column>
                    <el-table-column align="center" label="描述" prop="summary"></el-table-column>
                    <el-table-column align="center" label="货号" prop="itemNum"></el-table-column>
                    <el-table-column align="center" label="零售价" prop="price"></el-table-column>
                    <el-table-column align="center" label="市场价" prop="marketPrice"></el-table-column>
                    <el-table-column align="center" min-width="110px" label="操作">
                        <template slot-scope="scope">
                            <el-button type="primary" size="small" @click="handlerChangeItem(scope.row)">编辑</el-button>
                            <el-button type="warn" size="small" @click="handlerFelItem(scope.row.id)">删除</el-button>
                        </template>
                    </el-table-column>
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

        <el-dialog title="修改" :visible.sync="visibleDialog"
                   append-to-body width="500px" @close="restForm">
            <el-form :model="formData" ref="goodsForm" label-width="88px">
                <el-form-item label="商品名称" prop="name">
                    <el-input class="dialog-input" v-model="formData.name" placehoder="请输入商品名称如：红烧牛肉面"></el-input>
                </el-form-item>
                <el-form-item label="所属类型" prop="typeId">
                    <el-select v-model="formData.typeId">
                        <el-option v-for="item in sortType" :value="item.id" :label="item.name"
                                   :key="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="所属品牌" prop="brandId">
                    <el-select v-model="formData.brandId">
                        <el-option v-for="item in brandType" :value="item.id" :label="item.name"
                                   :key="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="副标题">
                    <el-input class="dialog-input" v-model="formData.subHead"></el-input>
                </el-form-item>
                <el-form-item label="描述">
                    <el-input class="dialog-input" type="textarea" v-model="formData.summary"></el-input>
                </el-form-item>
                <el-form-item label="货号">
                    <el-input class="dialog-input" v-model.number="formData.itemNum"></el-input>
                </el-form-item>
                <el-form-item label="零售价">
                    <el-input class="dialog-input" v-model.number="formData.price"></el-input>
                </el-form-item>
                <el-form-item label="市场价">
                    <el-input class="dialog-input" v-model.number="formData.marketPrice"></el-input>
                </el-form-item>
                <el-form-item label="库存">
                    <el-input class="dialog-input" v-model.number="formData.stock"></el-input>
                </el-form-item>
                <el-form-item label="重量">
                    <el-input class="dialog-input" v-model.number="formData.weight"></el-input>
                </el-form-item>
                <el-form-item label="排序">
                    <el-input class="dialog-input" v-model.number="formData.orderNum"></el-input>
                </el-form-item>
                <el-form-item label="">
                    <el-button size="small" type="primary" @click="handlerSubmit">确定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </LoadingBox>
</template>

<script lang="ts">
    import {goodsSortManage, goodsBrandManage, goodsManage, goodsGetManage} from '@/api/api';

    interface Table extends Goods {
        createTime: string;
        updateTime: string;
    }

    import {Component, Vue} from 'vue-property-decorator';

    @Component
    export default class AddGoods extends Vue {
        searchData: Page<goodsSearch> = {
            page: 1,
            pageSize: 50,
            info: {
                name: '',
                beginDate: '',
                endDate: ''
            }
        };
        total: number = 0;
        loading: boolean = false;
        visibleDialog: boolean = false;
        tableData: Table[] = [];
        sortType: Sorts[] = [];
        brandType: Brand[] = [];
        formData: Goods = {
            id: 0,
            name: '',
            typeId: '',
            brandId: '',
            subHead: '',
            summary: '',
            itemNum: '',
            price: '',
            marketPrice: '',
            stock: 0,
            weight: 0,
            orderNum: 0
        };

        handlerAddGoods() {
            this.formData.id = 0;
            this.visibleDialog = true;
        }

        handlerChangeItem(item: Goods) {
            this.formData = item;
            this.visibleDialog = true;
        }

        handlerFelItem(id: number) {
            goodsManage('delete', id).then((res: any) => {
                if (res.code === this.$global.HTTPS) {
                    this.setData();
                }
            });
        }

        handlerSubmit() {
            const goodsForm = this.$refs['goodsForm'] as any;
            const base = () => {
                this.$message.success('成功');
                this.setData();
                goodsForm.resetFields();
                this.visibleDialog = false;
            };
            this.loading = true;
            goodsForm.validate((valid: boolean) => {
                if (valid) {
                    if (this.formData.id) {
                        goodsManage('put', this.formData).then((res: any) => {
                            this.loading = false;
                            if (res.code === this.$global.HTTPS) {
                                base();
                            }
                        });
                    } else {
                        goodsManage('post', this.formData).then((res: any) => {
                            this.loading = false;
                            if (res.code === this.$global.HTTPS) {
                                base();
                            }
                        });
                    }
                } else {
                    this.$message.error('请按规则填写');
                }
            });
        }

        restForm() {
            const goodsForm = this.$refs['goodsForm'] as any;
            goodsForm.resetFields();
        }

        handleSizeChange(v: number) {
            this.searchData.pageSize = v;
            this.setData();
        }

        handleCurrentChange(v: number) {
            this.searchData.page = v;
            this.setData();
        }

        handlerSearch() {
            this.searchData.page = 1;
            this.setData();
        }

        setData() {
            goodsGetManage('post', this.searchData).then((res: any) => {
                if (res.code === this.$global.HTTPS) {
                    this.tableData = res.data.list;
                    this.total = res.data.total;
                }
            });
        }

        created() {
            Promise.all([goodsSortManage('get'), goodsBrandManage('get')]).then((resArr: any[]) => {
                this.sortType = resArr[0].data;
                this.brandType = resArr[1].data;
            });
        }

        mounted() {
            this.setData();
        }
    }
</script>

<style scoped>
    @import url('goods.scss');

    .dialog-input {
        width: 195px;
    }
</style>