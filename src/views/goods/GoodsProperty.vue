<template>
    <LoadingBox :loading="loading">
        <div class="content-box">
            <div class="goods-header">
                <span class="title"><i class="el-icon-tickets"></i>数据列表</span>
                <el-button size="small" type="primary" @click="handlerAddAttribute">添加品牌</el-button>
            </div>
            <div class="wx-table">
                <el-table :data="tableData" border>
                    <el-table-column prop="id" label="编号"></el-table-column>
                    <el-table-column align="center" prop="properties" label="属性名称"></el-table-column>
                    <el-table-column align="center" prop="updateTime" label="更新时间"></el-table-column>
                    <el-table-column align="center" label="操作">
                        <template slot-scope="scope">
                            <el-button size="small" type="primary" @click="handlerChangeItem(scope.row)">编辑</el-button>
                            <el-button size="small" type="primary" @click="handlerDelItem(scope.row.id)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="wx-page">
                <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="searchData.page"
                        :page-size="searchData.pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="total">
                </el-pagination>
            </div>
        </div>
        <el-dialog :visible.async="visibleDialog"
                   append-to-body width="40%" :close-on-click-modal="false">
            <el-form :model="formData" label-width="140px" ref="goodsProperty">
                <el-form-item label="属性名字" prop="name" :rules="rules.NotEmpty">
                    <el-input class="dialog-input" v-model="formData.name"></el-input>
                </el-form-item>
                <el-form-item label="是否是单选属性" prop="selectModel" :rules="rules.NotEmpty">
                    <el-radio-group v-model="formData.selectModel">
                        <el-radio :label="1">单选</el-radio>
                        <el-radio :label="2">多选</el-radio>
                        <el-radio :label="3">复选</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="可选属性">
                    <el-tag
                            :key="tag"
                            v-for="(tag,index) in formData.properties"
                            closable
                            :disable-transitions="false"
                            @close="handleClose(index)">
                        {{tag}}
                    </el-tag>
                    <el-input
                            class="input-new-tag"
                            v-if="inputVisible"
                            v-model="inputValue"
                            ref="saveTagInput"
                            size="small"
                            @keyup.enter.native="handleInputConfirm"
                            @blur="handleInputConfirm"
                    >
                    </el-input>
                    <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
                </el-form-item>
                <el-form-item label="">
                    <el-button @click="handlerSubmit">确定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </LoadingBox>
</template>
<style>
    .el-tag + .el-tag {
        margin-left: 10px;
    }

    .button-new-tag {
        margin-left: 10px;
        height: 32px;
        line-height: 30px;
        padding-top: 0;
        padding-bottom: 0;
    }

    .input-new-tag {
        width: 90px;
        margin-left: 10px;
        vertical-align: bottom;
    }


</style>
<script lang="ts">
    import rules from '@/utils/rules'

    interface Table extends Property {
        createTime: string;
        updateTime: string;
    }

    import {Component, Vue} from 'vue-property-decorator';
    import {goodsProperty, goodsGetProperty} from '@/api/api';

    @Component
    export default class GoodsProperty extends Vue {
        rules: Rules = rules;
        inputValue: string = '';
        loading: boolean = false;
        inputVisible: boolean = false;
        visibleDialog: boolean = false;
        tableData: Table[] = [];
        total: number = 0;
        searchData: Page<goodsSearch> = {
            page: 1,
            pageSize: 50,
            info: {
                name: ''
            }
        };
        formData: Property = {
            id: 0,
            name: '',
            properties: [],
            selectModel: 0
        };

        setData() {
            this.loading = true;
            goodsGetProperty('post', this.searchData).then((res: any) => {
                this.loading = false;
                if (res.code === this.$global.HTTPS) {
                    this.tableData = res.data.list.map((v:any)=>{
                        if(v&&v.properties){
                            return {
                                ...v,
                                properties:v.properties.split(',')
                            }
                        }
                    });
                    this.total = res.data.total;
                }
            })
        }

        handlerAddAttribute() {
            this.formData.id = 0;
            this.visibleDialog = true;
        }

        handlerChangeItem(v: Property) {
            this.formData = v;
            this.visibleDialog = true;
        }

        handlerDelItem(id: number) {
            goodsProperty('delete', id).then((res: any) => {
                if (res.code === this.$global.HTTPS) {
                    this.$message.success('删除成功');
                    this.setData();
                } else {
                    this.$message.error(res.message);
                }
            })
        }

        handlerSubmit() {
            const goodsProperty = this.$refs['goodsProperty'] as any;
            goodsProperty.validate((valid: boolean) => {
                if (valid) {
                    this.loading = true;
                    const args=Object.assign({},this.formData,{properties:this.formData.properties.join(',')});
                    const methods = this.formData.id ? 'put' : 'post';
                    goodsProperty(methods, args).then((res: any) => {
                        if (res.code === this.$global.HTTPS) {
                            this.$message.success('成功');
                            this.setData();
                            goodsProperty.resetFields();
                            this.visibleDialog = false;
                        }
                    })
                }
            })
        }

        showInput() {
            this.inputVisible = true;
            const oInput = this.$refs.saveTagInput as any;
            this.$nextTick(() => {
                oInput.$refs.input.focus();
            });
        }

        handleInputConfirm() {
            let inputValue = this.inputValue;
            if (inputValue) {
                this.formData.properties.push(inputValue);
            }
            this.inputVisible = false;
            this.inputValue = '';
        }

        handleClose(index: number) {
            this.formData.properties.splice(index, 1)
        }

        handleSizeChange(v: number) {
            this.searchData.pageSize = v;
            this.setData();
        }

        handleCurrentChange(v: number) {
            this.searchData.page = v;
            this.setData()
        }

        mounted() {
            this.setData()
        }
    }
</script>

<style scoped>
    @import "goods.scss";
</style>