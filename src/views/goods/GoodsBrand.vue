<template>
    <LoadingBox :loading="loading">
        <div class="content-box">
            <div class="goods-header">
                <span class="title"><i class="el-icon-tickets"></i>数据列表</span>
                <el-button size="small" type="primary" @click="handlerAddBrand">添加品牌</el-button>
            </div>
            <div class="wx-table">
                <el-table border :data="tableData">
                    <el-table-column min-width="55px" label="编号" prop="id"></el-table-column>
                    <el-table-column label="品牌名称" prop="name"></el-table-column>
                    <el-table-column label="排序" prop="orderNum"></el-table-column>
                    <el-table-column label="首字母" prop="firstChar"></el-table-column>
                    <el-table-column label="品牌公司" prop="brandCompany"></el-table-column>
                    <el-table-column min-width="160px" label="创建时间" prop="createTime"></el-table-column>
                    <el-table-column min-width="160px" label="创建时间" prop="updateTime"></el-table-column>
                    <el-table-column min-width="110px" label="操作" align="center">
                        <template slot-scope="scope">
                            <el-button size="small" type="primary" @click="handlerChangeItem(scope.row)">编辑</el-button>
                            <el-button size="small" type="danger" @click="handlerDelItem(scope.row.id)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <el-dialog title="修改" :visible.sync="visibleDialog"
                       append-to-body width="40%" :close-on-click-modal="false">
                <el-form label-width="88px" ref="brand" :model="formData">
                    <el-form-item label="品牌名称" prop="name" :rules="rules.NotEmpty">
                        <el-input v-model="formData.name"></el-input>
                    </el-form-item>
                    <el-form-item label="级别" prop="orderNum" :rules="rules.number">
                        <el-input v-model.number="formData.orderNum"></el-input>
                    </el-form-item>
                    <el-form-item label="首字母">
                        <el-input v-model="formData.firstChar"></el-input>
                    </el-form-item>
                    <el-form-item label="品牌公司">
                        <el-input v-model="formData.brandCompany"></el-input>
                    </el-form-item>
                    <el-form-item label="品牌logo">
                        <el-upload
                                class="avatar-uploader"
                                action="string"
                                :show-file-list="false"
                                :http-request="handlerSendImg">
                            <img v-if="formData.brandLogo" :src="baseUrl+''+formData.brandLogo" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                    </el-form-item>
                    <el-form-item label="品牌大图">
                        <el-upload
                                class="avatar-uploader"
                                action="string"
                                :show-file-list="false"
                                :http-request="handlerSendBigImg">
                            <img v-if="formData.brandBigIcon" :src="baseUrl+''+formData.brandBigIcon" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                    </el-form-item>
                    <el-form-item label="展示">
                        <el-radio v-model="formData.show" :label="1">是</el-radio>
                        <el-radio v-model="formData.show" :label="2">否</el-radio>
                    </el-form-item>
                    <el-form-item label="">
                        <el-button size="small" type="primary" @click="handlerSubmit">确定</el-button>
                    </el-form-item>
                </el-form>
            </el-dialog>
        </div>
    </LoadingBox>
</template>

<style>
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }

    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }

    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }

    .avatar {
        width: 100px;
        height: 100px;
        display: block;
    }
</style>

<script lang="ts">
    import rules from '@/utils/rules'
    import {goodsBrandManage, imgSend} from '@/api/api';
    import {Component, Vue} from 'vue-property-decorator';

    interface table extends Brand {
        createTime: string;
        updateTime: string;
    }

    @Component
    export default class GoodsBrand extends Vue {
        rules: Rules = rules;
        tableData: table[] = [];
        loading: boolean = false;
        visibleDialog: boolean = false;
        formData: Brand = {
            id: 0,
            name: '',
            orderNum: '',
            firstChar: '',
            brandCompany: '',
            brandLogo: '',
            brandBigIcon: '',
            show: 1
        };

        get baseUrl() {
            return process.env.VUE_APP_API_URL
        }

        setData() {
            this.loading = true;
            goodsBrandManage('get').then((res: any) => {
                this.loading = false;
                if (res.code === 0) {
                    this.tableData = res.data;
                } else {
                    this.$message.error(res.message);
                }
            });
        }

        handlerAddBrand() {
            this.formData.id = 0;
            this.visibleDialog = true;
        }

        handlerChangeItem(item: Brand) {
            this.formData = item;
            this.visibleDialog = true;
        }

        handlerDelItem(id: number) {
            goodsBrandManage('delete', id).then((res: any) => {
                if (res.code === this.$global.HTTPS) {
                    this.$message.success('成功');
                    this.setData();
                }
            });
        }

        handlerSendImg(params: any) {
            const _file = params.file;
            const isLt2M = _file.size / 1024 / 1024 < 2;
            var formData = new FormData();
            formData.append("file", _file);

            if (!isLt2M) {
                this.$message.error("请上传2M以下的.xlsx文件");
                return false;
            }

            imgSend('post', formData).then((res: any) => {
                if (res.code === this.$global.HTTPS) {
                    this.formData.brandLogo = res.data
                }
            })
        }

        handlerSendBigImg(params: any) {
            const _file = params.file;
            const isLt2M = _file.size / 1024 / 1024 < 2;
            var formData = new FormData();
            formData.append("file", _file);

            if (!isLt2M) {
                this.$message.error("请上传2M以下的.xlsx文件");
                return false;
            }

            imgSend('post', formData).then((res: any) => {
                if (res.code === this.$global.HTTPS) {
                    this.formData.brandBigIcon = res.data
                }
            })
        }

        handlerSubmit() {
            const rulerDom = this.$refs['brand'] as any;
            rulerDom.validate((valid: boolean) => {
                    if (valid) {
                        this.loading = true;
                        const methods = this.formData.id ? 'put' : 'post';
                        goodsBrandManage(methods, this.formData).then((res: any) => {
                            if (res.code === this.$global.HTTPS) {
                                this.$message.success('成功');
                                this.setData();
                                rulerDom.resetFields();
                                this.visibleDialog = false;
                            }
                        });
                    } else {
                        this.$message.error('请安要求填写');
                    }
                }
            );
        }

        mounted() {
            this.setData();
        }
    }
</script>

<style lang="scss" scoped>
    @import "goods";
</style>