<template>
    <LoadingBox :loading="loading">
        <div class="content-box">
            <div class="goods-header">
                <span class="title"><i class="el-icon-tickets"></i>数据列表</span>
                <el-button size="small" type="primary" @click="handlerAddBrand">添加品牌</el-button>
            </div>
            <div class="wx-table">
                <el-table :data="tableData" border>
                    <el-table-column label="编号" prop="id"></el-table-column>
                    <el-table-column label="名称" prop="name"></el-table-column>
                    <el-table-column align="center" label="设置">
                        <template slot-scope="scope">
                            <el-button size="small" type="primary" @click="handlerAddProperty(scope.row.id)">属性列表
                            </el-button>
                            <el-button size="small" type="primary" @click="handlerAddParam(scope.row.id)">参数列表
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
                <!--                <el-form-item label="属性">-->
                <!--                    <el-select v-model="formData.propertyId" multiple filterable clearable>-->
                <!--                        <el-option v-for="item in propertySelect" :label="item.name" :value="item.id"-->
                <!--                                   :key="item.id"></el-option>-->
                <!--                    </el-select>-->
                <!--                </el-form-item>-->
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
import { Component, Vue } from 'vue-property-decorator'
import { goodsAttribute, goodsProperty, goodsGetAttribute } from '@/api/api';

@Component
export default class GoodsAttribute extends Vue {
  tableData: Table[] = [];
  propertySelect: Property[] = [];
  total: number = 0;
  rules: Rules = rules;
  loading: boolean = false;
  visibleDialog: boolean = false;
  formData: Attribute = {
    id: 0,
    name: '',
    propertyId: [],
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
    goodsGetAttribute('post', this.searchData).then((res: any) => {
      this.loading = false;
      if (res.code === this.$global.HTTPS) {
        this.tableData = res.data.list;
        this.total = res.data.total;
      }
    })
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
    goodsAttribute('delete', id).then((res: any) => {
      if (res.code === this.$global.HTTPS) {
        this.$message.success('删除成功');
        this.setData();
      }
    })
  }

  handlerSubmit() {
    const oDome = this.$refs['goodsAttr'] as any;
    oDome.validate((valid: boolean) => {
      if (valid) {
        this.loading = true;
        const methods = this.formData.id ? 'put' : 'post';
        goodsAttribute(methods, this.formData).then((res: any) => {
          this.loading = false;
          if (res.code === this.$global.HTTPS) {
            this.$message.success('成功');
            this.setData();
            this.restForm();
          } else {
            this.$message.error(res.message)
          }
        })
      }
    })
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
    goodsProperty('get').then((res: any) => {
      if (res.code === this.$global.HTTPS) {
        this.propertySelect = res.data
      } else {
        this.$message.error(res.message)
      }
    })
  }

  restForm() {
    this.formData = {
      id: 0,
      name: '',
      propertyId: [],
    };
    this.visibleDialog = false;
  }

  handlerAddProperty(id: number) {
    this.$router.push(`/home/goods-property?id=${id}&type=1`)
  }

  handlerAddParam(id: number) {
    this.$router.push(`/home/goods-property?id=${id}&type=2`)
  }

  created() {
    this.getProperty()
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