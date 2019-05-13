<template>
    <LoadingBox :loading="loading">
        <div class="content-box">
            <div class="goods-header">
                <span class="title"><i class="el-icon-tickets"></i>数据列表</span>
                <div class="search-box">
                    <el-input size="small" class="search-input" placeholder="名称搜索"
                              v-model="searchData.name"></el-input>
                    <el-button size="small" type="primary" @click="handlerSearch">搜索</el-button>
                </div>
                <el-button type="primary" size="small" @click="handlerAddGoods">添加商品</el-button>
            </div>
            <div class="wx-table">
                <el-table border :data="tableData">
                    <el-table-column label="编号" prop="id"></el-table-column>
                    <el-table-column align="center" label="商品名称" prop="name"></el-table-column>
                    <el-table-column align="center" label="商品类型" prop="typeId">
                        <template slot-scope="scope">
                            {{scope.row.categoryId|filterIdToName(sortType)}}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="所属品牌">
                        <template slot-scope="scope">
                            {{scope.row.brandId|filterIdToName(brandType)}}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="副标题" prop="subHead"></el-table-column>
                    <el-table-column align="center" label="描述" prop="detail"></el-table-column>
                    <el-table-column width="190px" align="center" label="设置">
                        <template slot-scope="scope">
                            <el-button size="small" type="primary" @click="handlerGoodsSku(scope.row)">商品属性设置
                            </el-button>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" min-width="110px" label="操作">
                        <template slot-scope="scope">
                            <el-button size="small" type="primary" @click="handlerChangeItem(scope.row)">编辑</el-button>
                            <el-button size="small" type="warn" @click="handlerFelItem(scope.row.id)">删除</el-button>
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
                   append-to-body width="700px" @close="resetData">
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
                    <MulUpload v-model="formData.picture"></MulUpload>
                </el-form-item>
                <el-form-item label="单位">
                    <el-input v-model="formData.unit"></el-input>
                </el-form-item>
                <el-form-item label="商品状态">
                    <el-radio v-model="formData.status" :label="1">上线</el-radio>
                    <el-radio v-model="formData.status" :label="0">下线</el-radio>
                </el-form-item>
                <el-form-item label="">
                    <el-button type="primary" @click="handlerSubmitAddGoods">添加</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <el-dialog :visible.sync="visibleAttr" :close-on-click-modal="false"
                   append-to-body width="900px">
            <el-form label-width="110px">
                <el-form-item label="商品规格">
                    <el-card>
                        <template v-for="item in skuAttr">
                            <div style="display: flex;flex-direction: column">
                                <label>{{item.name}}:</label>
                                <el-checkbox-group v-if="item.multi===1" v-model="item.attrs">
                                    <el-checkbox v-for="v in item.values"
                                                 :label="item.id+'-'+v.id" :key="v.id">
                                        {{v.value}}
                                    </el-checkbox>
                                </el-checkbox-group>
                                <el-radio-group v-if="item.multi===0" v-model="item.attrs">
                                    <el-radio v-for="v in item.values" :label="v.id"
                                              :key="v.id">{{v.value}}
                                    </el-radio>
                                </el-radio-group>
                            </div>
                        </template>
                        <el-table border :data="skuParams.skuStockList" v-if="skuParams.skuStockList.length>0">
                            <el-table-column min-width="88px" v-for="(item,index) in skuAttr"
                                             :label="item.name" :key="item.id">
                                <template slot-scope="scope">
                                    {{skuMap.get(scope.row.skuList[index].attributeNameId+'-'+scope.row.skuList[index].attributeValueId).value}}
                                </template>
                            </el-table-column>
                            <el-table-column min-width="88px" label="销售ID">
                                <template slot-scope="scope">
                                    <el-input size="small" class="table-input" v-model="scope.row.skuId"/>
                                </template>
                            </el-table-column>
                            <el-table-column min-width="110px" label="原始价">
                                <template slot-scope="scope">
                                    <el-input size="small" class="table-input" v-model="scope.row.originPrice"/>
                                </template>
                            </el-table-column>
                            <el-table-column min-width="110px" label="零售价">
                                <template slot-scope="scope">
                                    <el-input size="small" class="table-input" v-model="scope.row.marketPrice"/>
                                </template>
                            </el-table-column>
                            <el-table-column min-width="88px" label="库存">
                                <template slot-scope="scope">
                                    <el-input size="small" class="table-input" v-model="scope.row.stock"/>
                                </template>
                            </el-table-column>
                            <el-table-column min-width="100px" label="图片">
                                <template slot-scope="scope">
                                    <MyUpload v-model="scope.row.pic"></MyUpload>
                                </template>
                            </el-table-column>
                            <el-table-column min-width="110px" label="库存预警值">
                                <template slot-scope="scope">
                                    <el-input size="small" class="table-input" v-model="scope.row.stockAlarm"/>
                                </template>
                            </el-table-column>
                            <el-table-column min-width="100px" label="销售状态">
                                <template slot-scope="scope">
                                    <el-switch
                                            v-model="scope.row.status"
                                            active-color="#13ce66"
                                            inactive-color="#ff4949"
                                            :active-value="1"
                                            :inactive-value="0">
                                    </el-switch>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作">
                                <template slot-scope="scope">
                                    <el-button size="small" type="primary"
                                               @click="handlerDelItem(scope.$index)">删除
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-card>
                </el-form-item>
                <el-form-item label="商品参数">
                    <el-card>
                        <template v-if="spuAttr.length>0" v-for="item in spuAttr">
                            <div class="card-params">
                                <label class="lable">{{item.name}}</label>
                                <el-select v-model="item.attrs" :multiple="item.multi===1" filterable clearable>
                                    <el-option v-for="v in item.values" :value="v.id" :key="v.id"
                                               :label="v.value"></el-option>
                                </el-select>
                            </div>
                        </template>
                    </el-card>
                </el-form-item>
                <el-form-item label="">
                    <el-button size="small" type="primary" @click="handlerSubmitSku">确定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </LoadingBox>
</template>

<script lang="ts">
import api from '@/api/api';
import rules from '@/utils/rules';

interface Table extends Goods {
  createTime: string;
  updateTime: string;
}

import { Component, Vue, Watch } from 'vue-property-decorator';
import { equalArray } from '@/utils/util';

@Component
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
  visibleAttr: boolean = false;
  tableData: Table[] = [];
  sortType: Sorts[] = [];
  brandType: Brand[] = [];
  skuAttr: AttributeAndValue[] = [];
  skuMap: Map<string, any> = new Map(); // 全部属性map attributeID+'/'+attributeValueId
  spuAttr: AttributeAndValue[] = [];
  skuParams: SkuRes = {
    id: 0,
    skuStockList: [],
    spuList: []
  };
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
    picture: ''
  };

  // 动态计算 skuStockList
  @Watch('skuAttr', { deep: true })
  handlerSetSkuStockList(v: any[]) {
    const _this = this;
    let empty = v.map((item: any) => {
      return [].concat(item.attrs);
    });
    let dictionary: any = []; // 字典集合
    let data: any = [];

    function dfs(dep: number) {
      if (empty.length <= dep) {
        const test: any = [];
        for (let j = 0; j < data.length; j++) {
          test.push({
            attributeNameId: Number(data[j].split('-')[0]),
            attributeValueId: Number(data[j].split('-')[1])
          });
        }
        dictionary.push([].concat(test));
        return;
      }
      const n = empty[dep];
      for (let i = 0; i < n.length; i++) {
        data[dep] = n[i];
        dfs(dep + 1);
      }
    }

    if (empty[this.skuAttr.length - 1] && empty[this.skuAttr.length - 1].length) {
      dfs(0);
    }

    const base = (test: skuList[]): boolean => {
      let bool = false;
      if (_this.skuParams.skuStockList.length) {
        _this.skuParams.skuStockList.forEach(v => {
          if (equalArray(v.skuList, test)) {
            bool = true;
          }
        });
      }
      return bool;
    };

    for (let i = 0; i < dictionary.length; i++) {
      let sku: any = {};
      sku = {
        originPrice: '',
        stock: '',
        stockAlarm: '',
        skuId: '',
        status: 1,
        pic: '',
        marketPrice: '',
        skuList: dictionary[i]
      };
      if (!base(dictionary[i])) {
        this.skuParams.skuStockList.push(sku);
      }
    }
  }

  // 动态计算 spu
  @Watch('skuAttr', { deep: true })
  handlerSkuAttr() {
    this.spuAttr.forEach(v => {
      if (v.attrs) {
        if (v.attrs.length) {
          for (let i = 0; i < v.attrs.length; i++) {
            this.skuParams.spuList.push({
              attributeNameId: Number(v.id),
              attributeValueId: Number(v.attrs[i])
            });
          }
        } else {
          this.skuParams.spuList.push({
            attributeNameId: Number(v.id),
            attributeValueId: Number(v.attrs)
          });
        }
      }
    });
  }

  handlerSubmitSku() {
    api.goodsSku('post', this.skuParams).then((res: Common<any>) => {
      if (res.code === this.$global.HTTPS) {
        this.$message.success(res.message);
      }
    });
  }

  handlerAddGoods() {
    this.formData.id = 0;
    this.visibleDialog = true;
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

  //添加商品
  handlerSubmitAddGoods() {
    const oDom = this.$refs['goodsAdd'] as any;
    oDom.validate((valide: boolean) => {
      if (valide) {
        api.goodsManage('post', this.formData).then((res: Common<any>) => {
          if (res.code === this.$global.HTTPS) {
            this.$message.success(res.message);
            this.resetData();
            this.setData();
          } else {
            this.$message.error(res.message);
          }
        });
      }
    });
  }

  handlerFelItem(v: number) {
    api.goodsManage('delete', v).then((res: Common<any>) => {
      if (res.code === this.$global.HTTPS) {
        this.$message.success(res.message);
        this.setData();
      } else {
        this.$message.error(res.message);
      }
    });
  }

  handlerChangeItem(v: Table) {
    this.formData = Object.assign({}, v);
    this.visibleDialog = true;
  }

  // 添加sku
  handlerGoodsSku(v: Goods) {
    this.skuParams.id = v.id;
    api.goodsAttribute('', v.categoryId).then((res: Common<any>) => {
      // sku属性
      this.skuAttr = res.data.filter((v: AttributeAndValue) => v.sale === 1).map((v: AttributeAndValue) => {
        return {
          ...v,
          attrs: []
        };
      });
      // 存储一个map()用于便利
      this.skuAttr.forEach((v: AttributeAndValue) => {
        v.values.forEach((t: valueItem) => {
          this.skuMap.set(v.id + '-' + t.id, t);
        });
      });
      // spu属性
      this.spuAttr = res.data.filter((v: Attribute) => v.sale === 0).map((v: AttributeAndValue) => {
        return {
          ...v,
          attrs: []
        };
      });
      // 获取存储的sku--复原checkbox
      api.goodsSku('get', { productId: v.id }).then((res: Common<SkuRes>) => {
        if (res.code === this.$global.HTTPS) {
          this.skuParams.skuStockList = res.data.skuStockList;
          res.data.skuStockList.forEach((v) => {
            v.skuList.forEach(t => {
              this.skuAttr.forEach(x => {
                if (t.attributeNameId === x.id) {
                  x.attrs.push(t.attributeNameId + '-' + t.attributeValueId);
                }
              });
            });
          });
          res.data.spuList.forEach(v => {
            this.spuAttr.forEach(t => {
              if (t.id === v.attributeNameId) {
                if (t.multi) {
                  t.attrs.push(v.attributeValueId);
                } else {
                  t.attrs = v.attributeValueId;
                }
              }
            });
          });
        }
      });
      this.visibleAttr = true;
    });
  }

  handlerDelItem(v: number) {
    this.skuParams.skuStockList.splice(v, 1);
  }

  setData() {
    this.loading = true;
    api.goodsManage('get', this.searchData).then((res: Common<PageRes>) => {
      this.loading = false;
      if (res.code === this.$global.HTTPS) {
        this.tableData = res.data.list;
        this.total = res.data.total;
      }
    });
  }

  resetData() {
    this.formData = {
      id: 0,
      name: '',
      categoryId: '',
      brandId: '',
      subHead: '',
      detail: '',
      orderNum: '',
      unit: '',
      status: 1,
      picture: ''
    };
    this.visibleDialog = false;
  }

  created() {
    Promise.all([api.goodsSortManage('get'), api.goodsBrandManage('get')]).then((resArr: any[]) => {
      this.sortType = resArr[0].data.list;
      this.brandType = resArr[1].data.list;
    });
  }

  mounted() {
    this.setData();
  }
}
</script>

<style lang="scss" scoped>
    @import url('goods.scss');

    .dialog-input {
        width: 195px;
    }


    .card-params {
        display: flex;
        margin-bottom: 10px;

        .lable {
            display: inline-block;
            width: 100px;
        }

    }
</style>