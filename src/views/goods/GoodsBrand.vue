<template>
    <LoadingBox :loading="false">
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
                        <SingleUpload v-model="formData.brandLogo"></SingleUpload>
                    </el-form-item>
                    <el-form-item label="品牌大图">
                        <SingleUpload v-model="formData.brandBigIcon"></SingleUpload>
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

</style>

<script lang="ts">
import rules from '@/utils/rules';
import api from '@/api/api';
import { Component, Vue } from 'vue-property-decorator';

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

  setData() {
    this.loading = true;
    api.goodsBrandManage('get').then((res: Common<any>) => {
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
    this.formData = Object.assign({}, item);
    this.visibleDialog = true;
  }

  handlerDelItem(id: number) {
    api.goodsBrandManage('delete', id).then((res: Common<any>) => {
      if (res.code === this.$global.HTTPS) {
        this.$message.success('成功');
        this.setData();
      }
    });
  }

  handlerSubmit() {
    const rulerDom = this.$refs['brand'] as any;
    rulerDom.validate((valid: boolean) => {
        if (valid) {
          this.loading = true;
          api.goodsBrandManage('post', this.formData).then((res: Common<any>) => {
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