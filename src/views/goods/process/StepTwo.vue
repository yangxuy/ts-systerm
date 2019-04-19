<template>
    <div>
        <el-form label-width="100px">
            <el-form-item label="选择属性类型">
                <el-select v-model="value.attributeId" v-if="goodsAttributeData" clearable>
                    <el-option v-for="item in goodsAttributeData" :label="item.name" :key="item.id"
                               :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="商品规格">
                <el-card>
                    <div v-if="selectProperty.length>0">
                        <template v-for="item in selectProperty">
                            <div style="display: flex;flex-direction: column">
                                <label>{{item.name}}:</label>
                                <el-checkbox-group v-if="item.selectModel===2" v-model="item.values">
                                    <el-checkbox v-for="v in item.propertyList" :label="v" :key="v"></el-checkbox>
                                </el-checkbox-group>
                                <el-radio-group v-if="item.selectModel===1" v-model="item.values">
                                    <el-radio v-for="v in item.propertyList" :label="v" :key="v"></el-radio>
                                </el-radio-group>
                            </div>
                        </template>
                        <el-table border :data="tableData" v-if="tableData.length>0">
                            <el-table-column min-width="88px" v-for="item in selectProperty" :label="item.name"
                                             :key="item.id">
                                <template slot-scope="scope">
                                    {{scope.row[item.name] ? scope.row[item.name]:''}}
                                </template>
                            </el-table-column>
                            <el-table-column min-width="110px" label="销售价格">
                                <template slot-scope="scope">
                                    <el-input class="table-input" v-model="scope.row.price"/>
                                </template>
                            </el-table-column>
                            <el-table-column min-width="88px" label="库存">
                                <template slot-scope="scope">
                                    <el-input class="table-input" v-model="scope.row.stock"/>
                                </template>
                            </el-table-column>
                            <el-table-column min-width="110px" label="库存预警值">
                                <template slot-scope="scope">
                                    <el-input class="table-input" v-model="scope.row.stockAlarm"/>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作">
                                <template slot-scope="scope">
                                    <el-button size="small" type="primary" @click="handlerDelItem(scope.$index)">删除
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </el-card>
            </el-form-item>
            <el-form-item label="属性图片" v-if="needPictureList.length>0">
                <el-card>
                    <template v-for="item in needPictureList">
                        <div class="property_pic">
                            <label style="line-height: 1;margin-right: 20px">{{item.name}}:</label>
                            <SingleUpload v-model="item[item.name]"></SingleUpload>
                        </div>
                    </template>
                    <!--                    <div>-->
                    <!--                        <label>金色</label>-->
                    <!--                        <SingleUpload v-model="testUrl"></SingleUpload>-->
                    <!--                    </div>-->
                </el-card>
            </el-form-item>
            <el-form-item label="商品参数">
                <el-card>
                    <template v-if="selectParams.length>0" v-for="item in selectParams">
                        <div class="card-params">
                            <label class="lable">{{item.name}}</label>
                            <el-select v-model="item.values" :multiple="item.selectModel===2" filterable clearable>
                                <el-option v-for="v in item.propertyList" :value="v" :key="v" :label="v"></el-option>
                            </el-select>
                        </div>
                    </template>
                </el-card>
            </el-form-item>
        </el-form>
    </div>
</template>
<style scoped>
    .property_pic {
        display: flex;
    }
</style>
<script lang="ts">
import RadioOrCheckBox from '@/components/RadioOrCheckBox.vue'
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { goodsAttribute, goodsProperty } from '@/api/api';

@Component({
  components: { RadioOrCheckBox }
})
export default class StepTwo extends Vue {
  @Prop() value: Goods;

  color: string[] = [];
  // cap: any[] = [];
  initData: Sku[] = [];
  goodsAttributeData: Property[] = [];
  selectProperty: Property[] = [];
  selectParams: Property[] = [];
  // properId: string = '';
  // testUrl: any = 'http://img5.imgtn.bdimg.com/it/u=353153124,1043237645&fm=26&gp=0.jpg';

  @Watch('value.attributeId')
  handlerChangePropertyId(val: number[]) {
    if (val) {
      goodsProperty('get', { attributeId: val }).then((res: any) => {
        this.selectProperty = res.data.filter((v: Property) => v.propertyType === 1).map((v: Property) => {
          return {
            ...v,
            values: []
          }
        });
        this.selectParams = res.data.filter((v: Property) => v.propertyType === 2).map((v: Property) => {
          return {
            ...v,
            values: []
          }
        })
      });
    }
  }

  // 获取需要添加图片的属性
  get picProperty() {
    return this.selectProperty.filter((item: Property) => item.isPic).map((item: Property) => item.values)
  }

  // 获取属性合并列表
  get tableData() {
    let arrData: any = [];
    // const res: any[] = [];
    if (this.selectProperty.length < 0) {
      return []
    }
    let empty = this.selectProperty.map((item: any) => {
      return item.values instanceof Array ? item.values : [item.values]
    });
    // example empty= [['白色','黑色'],['X','XL']]
    const dfs = (depth: number, data: string[], list: any[]) => {
      if (list.length <= depth) {
        let data2 = data.toString();
        arrData.push(data2);
        return
      }
      const row = list[depth];
      for (let i = 0; i < row.length; i++) {
        data[depth] = row[i];
        dfs(depth + 1, data, list)
      }
    };
    dfs(0, [], empty);
    //example arrData=['白色,X','白色,XL','黑色,X','黑色,XL']
    if (arrData.length <= 0) {
      return []
    }
    for (let i = 0; i < arrData.length; i++) {
      let sku: any = {};
      for (let j = 0; j < arrData[i].split(',').length; j++) {
        // sku={'颜色':'白色','尺寸':'X',price: '', stock: '', stockAlarm: '' }
        sku[this.selectProperty[j].name] = arrData[i].split(',')[j];
        sku = { ...sku, price: '', stock: '', stockAlarm: '' }
      }
      this.initData.push({
        ...sku
      })
    }
    return this.initData
  }

  set tableData(v: any) {
    this.initData = v
  }

  get needPictureList() {
    const empty: string[] = [];
    this.selectProperty.forEach((v) => {
      if (v.needPic === 1) {
        if (v.values) {
          if (v.values instanceof Array) {
            empty.push(...v.values)
          } else {
            empty.push(v.values)
          }
        }
      }
    });
    const data: any = empty.map((v) => {
      let obj: any = {};
      obj['name'] = v;
      obj[v] = '';
      return obj
    });
    return data
  }

  handlerDelItem(index: number) {
    this.tableData.splice(index, 1)
  }

  checkChange(v: any[]) {
    this.color = v
  }

  setData() {
    goodsAttribute('get').then((res: any) => {
      if (res.code === this.$global.HTTPS) {
        this.goodsAttributeData = res.data
      }
    })
  }

  created() {
    console.log(this.value.skuStockList.length)
    this.setData();
    this.tableData = this.value.skuStockList;
    console.log(this.tableData);
    this.selectProperty = [
      {
        id: 1,
        name: '颜色',
        needPic: 1,
        propertyType: 1,
        attributeId: 1,
        propertyList: ['黑色', '白色', '红色'],
        selectModel: 2,
        orderNum: 1,
        values: []
      },
      {
        id: 2,
        name: '尺寸',
        needPic: 0,
        propertyType: 1,
        attributeId: 1,
        propertyList: ['X', 'XL', 'XXL'],
        selectModel: 1,
        orderNum: 1,
        values: []
      },
    ];

    this.selectParams = [
      {
        id: 1,
        name: '存储',
        needPic: 1,
        propertyType: 2,
        attributeId: 1,
        propertyList: ['4G', '5G', '16G'],
        selectModel: 1,
        orderNum: 1,
        values: []
      },
      {
        id: 2,
        name: '适宜人群',
        needPic: 1,
        propertyType: 2,
        attributeId: 1,
        propertyList: ['少年', '老年', '中年'],
        selectModel: 2,
        orderNum: 1,
        values: []
      },
    ];
  }

  mounted() {
    let obj: any = {};
    const arr = [{ name: '颜色', values: '白色' }, { name: '尺寸', values: 'X' }] // {'颜色':'白色','尺寸':'X'}
    arr.forEach((v) => {
      obj[v.name] = v.values
    });
  }
}
</script>

<style lang="scss" scoped>
    .card-params {
        display: flex;
        margin-bottom: 10px;

        .lable {
            display: inline-block;
            width: 100px;
        }
    }

</style>