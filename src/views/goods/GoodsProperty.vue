<template>
    <LoadingBox :loading="loading">
        <div class="content-box">
            <div class="goods-header">
                <span class="title"><i class="el-icon-tickets"></i>数据列表</span>
                <el-button size="small" type="primary" @click="handlerAddAttribute">添加属性</el-button>
            </div>
            <div class="wx-table">
                <el-table :data="tableData" border>
                    <el-table-column prop="id" label="编号"></el-table-column>
                    <el-table-column align="center" prop="orderNum" label="属性排序"></el-table-column>
                    <el-table-column prop="value" label="属性值"></el-table-column>
                    <el-table-column align="center" prop="updateTime" label="更新时间"></el-table-column>
                    <el-table-column align="center" label="操作">
                        <template slot-scope="scope">
                            <el-button size="small" type="primary" @click="handlerChangeItem(scope.row)">编辑</el-button>
                            <el-button size="small" type="danger" @click="handlerDelItem(scope.row.id)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <el-dialog :visible.sync="visibleDialog" @open="handlerOpen" title="属性值" center
                   append-to-body width="40%" :close-on-click-modal="false">
            <el-form :model="formData" label-width="140px" ref="goodsProperty">
                <el-form-item label="属性值" :rules="rules.NotEmpty">
                    <el-input class="dialog-input" v-model="formData.value"></el-input>
                </el-form-item>
                <el-form-item label="排序" prop="orderNum" :rules="rules.number">
                    <el-input class="dialog-input" v-model.number="formData.orderNum"></el-input>
                </el-form-item>
                <el-form-item label="">
                    <el-button type="primary" @click="handlerSubmit">确定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </LoadingBox>
</template>
<script lang="ts">
import rules from '@/utils/rules';

interface Table extends AttributeValue {
  createTime: string;
  updateTime: string;
}

import { Component, Vue } from 'vue-property-decorator';
import api from '@/api/api';

@Component
export default class GoodsProperty extends Vue {
  loading: boolean = false;
  visibleDialog: boolean = false;
  rules: Rules = rules;
  tableData: Table[] = [];
  total: number = 0;
  formData: AttributeValue = {
    id: 0,
    attributeId: 0,
    value: '',
    orderNum: ''
  };

  setData() {
    this.loading = true;
    api.goodsAttributeValue('get', {
      attributeId: this.formData.attributeId
    }).then((res: any) => {
      this.loading = false;
      if (res.code === this.$global.HTTPS) {
        this.tableData = res.data;
      }
    });
  }

  handlerAddAttribute() {
    this.formData.id = 0;
    this.visibleDialog = true;
  }

  handlerChangeItem(v: any) {
    this.formData = v;
    this.visibleDialog = true;
  }

  handlerOpen() {
    this.formData = Object.assign({}, this.formData);
  }

  handlerDelItem(id: number) {
    api.goodsAttributeValue('delete', id).then((res: Common<any>) => {
      if (res.code === this.$global.HTTPS) {
        this.$message.success('删除成功');
        this.setData();
      } else {
        this.$message.error(res.message);
      }
    });
  }

  handlerSubmit() {
    const goodsDom = this.$refs['goodsProperty'] as any;
    goodsDom.validate((valid: boolean) => {
      if (valid) {
        this.loading = true;
        api.goodsAttributeValue('post', this.formData).then((res: Common<any>) => {
          if (res.code === this.$global.HTTPS) {
            this.$message.success('成功');
            this.setData();
            this.resetForm();
          }
        });
      }
    });
  }

  resetForm() {
    this.formData = {
      id: 0,
      attributeId: Number(this.$route.query.id),
      value: '',
      orderNum: ''
    };
    this.visibleDialog = false;
  }

  mounted() {
    if (this.$route.query.id) {
      this.formData.attributeId = Number(this.$route.query.id);
    }
    this.setData();
  }
}
</script>

<style scoped>
    @import "goods.scss";
</style>