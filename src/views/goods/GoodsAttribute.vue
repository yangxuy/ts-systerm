<template>
    <LoadingBox :loading="false">
        <div class="content-box">
            <div class="goods-header">
                <span class="title"><i class="el-icon-tickets"></i>数据列表</span>
                <el-select size="small" v-model="searchData.categoryId" filterable clearable>
                    <el-option v-for="item in propertySelect" :label="item.name" :value="item.id"
                               :key="item.id"></el-option>
                </el-select>
                <el-button size="small" type="primary" @click="handlerSearch">搜索</el-button>
                <el-button size="small" type="primary" @click="handlerAddBrand">添加属性</el-button>
            </div>
            <div class="wx-table">
                <el-table :data="tableData" border>
                    <el-table-column label="编号" prop="id"></el-table-column>
                    <el-table-column label="名称" prop="name"></el-table-column>
                    <el-table-column label="排序" prop="orderNum"></el-table-column>
                    <el-table-column align="center" label="设置">
                        <template slot-scope="scope">
                            <el-button size="small" type="primary" @click="handlerAddProperty(scope.row.id)">添加属性值
                            </el-button>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="操作">
                        <template slot-scope="scope">
                            <el-button size="small" type="primary" @click="handlerChangeItem(scope.row)">编辑</el-button>
                            <el-button size="small" type="warn" @click="handlerDelItem(scope.row.id)">删除</el-button>
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
        <el-dialog title="修改" :visible.sync="visibleDialog"
                   append-to-body width="433px" :close-on-click-modal="false">
            <el-form :model="formData" label-width="70px" ref="goodsAttr">
                <el-form-item label="名称" prop="name" :rules="rules.NotEmpty">
                    <el-input class="dialog-input" v-model="formData.name"></el-input>
                </el-form-item>
                <el-form-item label="所属分类">
                    <el-select v-model="formData.categoryId" filterable clearable>
                        <el-option v-for="item in propertySelect" :label="item.name" :value="item.id"
                                   :key="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="销售属性">
                    <el-radio v-model="formData.sale" :label="0">不是</el-radio>
                    <el-radio v-model="formData.sale" :label="1">是</el-radio>
                </el-form-item>
                <el-form-item label="属性">
                    <el-radio v-model="formData.multi" :label="0">单选</el-radio>
                    <el-radio v-model="formData.multi" :label="1">多选</el-radio>
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
interface Table extends Attribute {
  createTime: string;
  updateTime: string;
}

import rules from '@/utils/rules';
import { Component, Vue } from 'vue-property-decorator';
import api from '@/api/api';

@Component
export default class GoodsAttribute extends Vue {
  tableData: Table[] = [];
  propertySelect: AttributeValue[] = [];
  total: number = 0;
  rules: Rules = rules;
  loading: boolean = false;
  visibleDialog: boolean = false;
  formData: Attribute = {
    id: 0,
    name: '',
    categoryId: '',
    sale: 1,
    multi: 1,
    orderNum: ''
  };
  searchData: Page = {
    page: 1,
    pageSize: 50,
    categoryId: ''
  };

  setData() {
    this.loading = true;
    api.goodsAttribute('get', this.searchData).then((res: Common<PageRes>) => {
      this.loading = false;
      if (res.code === this.$global.HTTPS) {
        this.tableData = res.data.list;
      }
    });
  }

  handlerAddBrand() {
    this.formData.id = 0;
    this.visibleDialog = true;
  }

  handlerChangeItem(v: Attribute) {
    this.formData = v;
    this.visibleDialog = true;
  }

  handlerDelItem(id: number) {
    api.goodsAttribute('delete', id).then((res: Common<any>) => {
      if (res.code === this.$global.HTTPS) {
        this.$message.success('删除成功');
        this.setData();
      }
    });
  }

  handlerSubmit() {
    const oDome = this.$refs['goodsAttr'] as any;
    oDome.validate((valid: boolean) => {
      if (valid) {
        this.loading = true;
        const methods = this.formData.id ? 'put' : 'post';
        api.goodsAttribute(methods, this.formData).then((res: Common<any>) => {
          this.loading = false;
          if (res.code === this.$global.HTTPS) {
            this.$message.success('成功');
            this.setData();
            this.restForm();
          } else {
            this.$message.error(res.message);
          }
        });
      }
    });
  }

  handleSizeChange(v: number) {
    this.searchData.pageSize = v;
    this.setData();
  }

  handleCurrentChange(v: number) {
    this.searchData.page = v;
    this.setData();
  }

  // 获取属性
  getProperty() {
    api.goodsSortManage('get').then((res: any) => {
      if (res.code === this.$global.HTTPS) {
        this.propertySelect = res.data.list;
      } else {
        this.$message.error(res.message);
      }
    });
  }

  restForm() {
    this.formData = {
      id: 0,
      name: '',
      categoryId: '',
      orderNum: '',
      sale: 1,
      multi: 1
    };
    this.visibleDialog = false;
  }

  handlerAddProperty(id: number) {
    this.$router.push(`/home/goods-property?id=${id}`);
  }

  handlerSearch() {
    this.searchData.page = 1;
    this.setData();
  }

  created() {
    this.getProperty();
  }

  mounted() {
    this.setData();
  }
}
</script>

<style scoped>
    @import "goods.scss";

    .dialog-input {
        width: 200px;
    }
</style>