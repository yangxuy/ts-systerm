<template>
    <LoadingBox :loading="loading">
        <div class="content-box">
            <div class="goods-header">
                <span class="title"><i class="el-icon-tickets"></i>数据列表</span>
                <div class="search-box">
                    <el-input class="search-input" placeholder="名称搜索"
                              v-model="searchData.name"></el-input>
                    <!--                    <el-date-picker class="search-input" v-model="searchData.info.beginDate"-->
                    <!--                                    placeholder="开始时间"-->
                    <!--                                    value-format="yyyy-MM-dd HH:mm:ss" type="datetime">-->
                    <!--                    </el-date-picker>-->
                    <!--                    <el-date-picker class="search-input" v-model="searchData.info.endDate"-->
                    <!--                                    placeholder="结束时间"-->
                    <!--                                    value-format="yyyy-MM-dd HH:mm:ss" type="datetime">-->
                    <!--                    </el-date-picker>-->
                    <el-button type="primary" @click="handlerSearch">搜索</el-button>
                </div>
                <el-button type="primary" @click="handlerAddGoods">添加商品</el-button>
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
                    <el-table-column align="center" label="零售价" prop="price"></el-table-column>
                    <el-table-column align="center" label="市场价" prop="marketPrice"></el-table-column>
                    <el-table-column align="center" min-width="110px" label="操作">
                        <template slot-scope="scope">
                            <el-button type="primary" @click="handlerChangeItem(scope.row)">编辑</el-button>
                            <el-button type="warn" @click="handlerFelItem(scope.row.id)">删除</el-button>
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

        <el-dialog title="商品" :visible.sync="visibleDialog" :close-on-click-modal="false"
                   append-to-body width="700px" @close="restForm">
            <el-form :model="formData" ref="goodsAdd" label-width="100px">
                <el-form-item label="商品名称" prop="name" :rules="rules.NotEmpty">
                    <el-input v-model="formData.name"></el-input>
                </el-form-item>
                <el-form-item label="所属品牌" prop="brandId" :rules="rules.NotEmpty">
                    <el-select v-model="formData.brandId">
                        <el-option v-for="item in brandType" :key="item.id" :value="item.id"
                                   :label="item.name"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="所属分类" prop="categoryId" :rules="rules.NotEmpty">
                    <el-select v-model="formData.categoryId">
                        <el-option v-for="item in sortType" :key="item.id" :value="item.id"
                                   :label="item.name"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="副标题">
                    <el-input v-model="formData.subHead"></el-input>
                </el-form-item>
                <el-form-item label="描述">
                    <el-input type="textarea" v-model="formData.detail"></el-input>
                </el-form-item>
                <el-form-item label="排序">
                    <el-input v-model.number="formData.orderNum"></el-input>
                </el-form-item>
                <el-form-item label="商品图片">
                    <MulUpload v-model="formData.pictureList"></MulUpload>
                </el-form-item>
                <el-form-item label="商品状态">
                    <el-radio v-model="formData.status" :label="1">上线</el-radio>
                    <el-radio v-model="formData.status" :label="0">下线</el-radio>
                </el-form-item>
                <el-form-item label="">
                    <el-button type="primary" @click="handlerSubmitAddGoods">添加</el-button>
                </el-form-item>
            </el-form>
            <!--            <el-steps :active="active" finish-status="success">-->
            <!--                <el-step title="步骤 1"></el-step>-->
            <!--                <el-step title="步骤 2"></el-step>-->
            <!--                <el-step title="步骤 3"></el-step>-->
            <!--            </el-steps>-->
            <!--            <StepOne v-if="active===0" v-model="formData"></StepOne>-->
            <!--            <StepTwo v-if="active===1" v-model="formData"></StepTwo>-->
            <!--            <el-button style="margin-top: 12px;" :disabled="active===0" @click="preStep">上一步</el-button>-->
            <!--            <el-button style="margin-top: 12px;" :disabled="active===3" @click="nextStep">下一步</el-button>-->
            <!--            <el-button style="margin-top: 12px;" @click="handlerSaveData">保存数据</el-button>-->
            <!--            <el-button style="margin-top: 12px;" @click="handlerRecoverData">恢复数据</el-button>-->
        </el-dialog>
    </LoadingBox>
</template>

<script lang="ts">
// import StepOne from './process/StepOne.vue';
// import StepTwo from './process/StepTwo.vue';
import api from '@/api/api';
import rules from '@/utils/rules';

interface Table extends Goods {
  createTime: string;
  updateTime: string;
}

import { Component, Vue, Watch } from 'vue-property-decorator';

@Component({
  // components: { StepOne, StepTwo }
})
export default class AddGoods extends Vue {
  searchData: Page = {
    page: 1,
    pageSize: 50,
    name: ''
  };
  total: number = 0;
  active: number = 0;
  loading: boolean = false;
  rules: Rules = rules;
  visibleDialog: boolean = false;
  tableData: Table[] = [];
  sortType: Sorts[] = [];
  brandType: Brand[] = [];
  formData: Goods = {
    id: 0,
    name: '',
    categoryId: '',
    brandId: '',
    subHead: '',
    detail: '',
    orderNum: '',
    unit: '',
    status: 1,
    pictureList: ''
  };

  // 动态计算 skuStockList
  // @Watch('formData.property', { deep: true })
  // handlerSetSkuStockList(v: Property[]) {
  //   // 计算skuStockList--》新加+原来
  //   let arrData: any = [];
  //   let empty = v.map((item: Property) => {
  //     return item.values instanceof Array ? item.values : [item.values];
  //   });
  //   const dfs = (depth: number, data: string[], list: any[]) => { // dfs 笛卡尔集变换
  //     if (list.length <= depth) {
  //       let data2 = data.toString();
  //       const arr = this.formData.skuStockList.map(v => v.str);
  //       if (arr.indexOf(data2) < 0) { // 添加不存在的
  //         arrData.push(data2);
  //       }
  //       return;
  //     }
  //     const row = list[depth];
  //     for (let i = 0; i < row.length; i++) {
  //       data[depth] = row[i];
  //       dfs(depth + 1, data, list);
  //     }
  //   };
  //   dfs(0, [], empty);
  //
  //   for (let i = 0; i < arrData.length; i++) {
  //     let sku: any = {};
  //     for (let j = 0; j < arrData[i].split(',').length; j++) {
  //       // sku={'颜色':'白色','尺寸':'X',price: '', stock: '', stockAlarm: '' }
  //       sku[v[j].name] = arrData[i].split(',')[j];
  //       sku = { ...sku, price: '', stock: '', stockAlarm: '', str: arrData[i] };
  //     }
  //     this.formData.skuStockList.push(sku);
  //   }
  //
  //   // 计算属性图片---》新加+原来
  //   let picArr: string[] = [];
  //   v.map((item: Property) => {
  //     if (item.needPic === 1) {
  //       const arr = this.formData.propertyExt.map(v => v.name);
  //       if (item.values instanceof Array) {
  //         item.values.forEach((t) => {
  //           if (arr.indexOf(t) < 0) {
  //             picArr.push(t);
  //           }
  //         });
  //       } else {
  //         if (arr.indexOf(item.values) < 0) {
  //           picArr.push(item.values);
  //         }
  //       }
  //     }
  //   });
  //   const arr = picArr.map((v) => {
  //     let obj: any = {};
  //     obj['name'] = v;
  //     obj[v] = '';
  //     return obj;
  //   });
  //   if (arr.length) {
  //     this.formData.propertyExt.push(...arr);
  //   }
  // }

  handlerAddGoods() {
    this.formData.id = 0;
    this.visibleDialog = true;
  }

  //
  // handlerChangeItem(item: Goods) {
  //   this.formData = item;
  //   this.visibleDialog = true;
  // }
  //
  // handlerFelItem(id: number) {
  //   api.goodsManage('delete', id).then((res: Common<any>) => {
  //     if (res.code === this.$global.HTTPS) {
  //       this.setData();
  //     }
  //   });
  // }
  //
  // handlerSubmit() {
  //   const goodsForm = this.$refs['goodsForm'] as any;
  //   const base = () => {
  //     this.$message.success('成功');
  //     this.setData();
  //     goodsForm.resetFields();
  //     this.visibleDialog = false;
  //   };
  //   this.loading = true;
  //   goodsForm.validate((valid: boolean) => {
  //     if (valid) {
  //       if (this.formData.id) {
  //         api.goodsManage('put', this.formData).then((res: any) => {
  //           this.loading = false;
  //           if (res.code === this.$global.HTTPS) {
  //             base();
  //           }
  //         });
  //       } else {
  //         api.goodsManage('post', this.formData).then((res: any) => {
  //           this.loading = false;
  //           if (res.code === this.$global.HTTPS) {
  //             base();
  //           }
  //         });
  //       }
  //     } else {
  //       this.$message.error('请按规则填写');
  //     }
  //   });
  // }
  //
  restForm() {

  }

  //
  handleSizeChange(v: number) {
    this.searchData.pageSize = v;
    this.setData();
  }

  //
  handleCurrentChange(v: number) {
    this.searchData.page = v;
    this.setData();
  }

  //
  handlerSearch() {
    this.searchData.page = 1;
    this.setData();
  }

  //
  // setData() {
  //   api.goodsGetManage('post', this.searchData).then((res: any) => {
  //     if (res.code === this.$global.HTTPS) {
  //       this.tableData = res.data.list;
  //       this.total = res.data.total;
  //     }
  //   });
  // }
  //
  // preStep() {
  //   if (this.active > 0) {
  //     this.active--;
  //   }
  // }
  //
  // nextStep() {
  //   if (this.active < 3) {
  //     this.active++;
  //   }
  // }
  //
  // // sava
  // handlerSaveData() {
  //   window.localStorage.setItem('goods', JSON.stringify(this.formData));
  // }
  //
  // handlerRecoverData() {
  //   console.log(window.localStorage.getItem('goods'));
  //   this.formData = JSON.parse(window.localStorage.getItem('goods') as string);
  //   // console.log(this.formData.propertyExt);
  // }

  //添加商品
  handlerSubmitAddGoods() {
    const oDom = this.$refs['goodsAdd'] as any;
    oDom.validate((valide: boolean) => {
      if (valide) {
        api.goodsManage('post', this.formData).then((res: Common<any>) => {
          if (res.code === this.$global.HTTPS) {
            this.$message.success(res.message);
            this.setData();
          }
        });
      }
    });
  }

  setData() {
    api.goodsManage('get', this.searchData).then((res: Common<PageRes>) => {
      if (res.code === this.$global.HTTPS) {
        this.tableData = res.data.list;
        this.total = res.data.total;
      }
    });
  }

  created() {
    Promise.all([api.goodsSortManage('get'), api.goodsBrandManage('get')]).then((resArr: any[]) => {
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