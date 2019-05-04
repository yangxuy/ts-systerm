<template>
    <LoadingBox :loading="false">
        <div class="goods-header">
            <span class="title"><i class="el-icon-tickets"></i>数据列表</span>
            <el-button size="small" type="primary" @click="handlerAddSort">添加商品分类</el-button>
        </div>
        <div class="wx-table">
            <el-table border :data="tableData">
                <el-table-column label="编号" prop="id"></el-table-column>
                <el-table-column label="分类名称" prop="name"></el-table-column>
                <el-table-column label="排序" prop="orderNum"></el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button size="small" type="primary" @click="handlerChangeItem(scope.row)">编辑</el-button>
                        <el-button size="small" type="danger" @click="handlerDelItem(scope.row.id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog title="修改" :visible.sync="visibleDialog"
                   append-to-body width="40%">
            <el-form ref="ruleForm" label-width="88px" :model="formData" :rules="rules">
                <el-form-item label="分类名称" prop="name">
                    <el-input v-model="formData.name"></el-input>
                </el-form-item>
                <el-form-item label="父类" prop="parentId">
                    <el-select v-model.number="formData.parentId">
                        <el-option v-for="item in tableData" :key="item.id" :value="item.id"
                                   :label="item.name"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="排序">
                    <el-input v-model="formData.orderNum"></el-input>
                </el-form-item>
                <el-form-item label="">
                    <el-button size="middle" type="primary" @click="handlerSubmit">确定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </LoadingBox>
</template>

<script lang="ts">
import api from '@/api/api';
import { Component, Vue } from 'vue-property-decorator';


interface table extends Sorts {
  createTime: string
}

class Base {
  constructor() {

  }
}

@Component
export default class GoodsSort extends Vue {
  tableData: table[] = [];
  loading: boolean = false;
  visibleDialog: boolean = false;
  formData: Sorts = {
    id: 0,
    name: '',
    parentId: '',
    orderNum: ''
  };
  rules: any = {
    name: [
      { required: true, message: '请输入分类名称', trigger: 'blur' },
      { min: 1, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
    ],
    order: [
      { required: true, message: '请选择活动区域', trigger: 'change' },
      { type: 'number', message: '级别必须是数子' }
    ]
  };

  setData() {
    this.loading = true;
    api.goodsSortManage('get').then((res: Common<any>) => {
      if (res.code === this.$global.HTTPS) {
        this.loading = false;
        this.tableData = res.data;
      }
    }).catch((err) => {
      this.$message.error(err);
    });
  }

  handlerAddSort() {
    this.formData.id = 0;
    this.visibleDialog = true;
  }

  handlerChangeItem(item: Sorts) {
    this.formData = Object.assign({}, item);
    this.visibleDialog = true;
  }

  handlerDelItem(id: number) {
    api.goodsSortManage('delete', id).then((res: Common<any>) => {
      if (res.code === this.$global.HTTPS) {
        this.$message.success(res.message);
        this.setData();
      } else {
        this.$message.error(res.message);
      }
    });
  }

  handlerSubmit() {
    const formDom = this.$refs['ruleForm'] as any;
    formDom.validate((valid: boolean) => {
      if (valid) {
        this.loading = true;
        api.goodsSortManage('post', this.formData).then((res: Common<any>) => {
          if (res.code === this.$global.HTTPS) {
            this.$message.success('成功');
            this.setData();
            formDom.resetFields();
            this.visibleDialog = false;
          }
        });
      } else {
        this.$message.error('请按照规则填写');
        return false;
      }
    });
  }

  mounted() {
    this.setData();
  }
}
</script>

<style lang="scss" scoped>
    @import "goods";
</style>