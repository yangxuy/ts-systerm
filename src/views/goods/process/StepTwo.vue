<!--<template>-->
<!--    <div>-->
<!--        <el-form label-width="100px">-->
<!--            <el-form-item label="商品分类">-->
<!--                <el-select>-->
<!--                    <el-option></el-option>-->
<!--                </el-select>-->
<!--            </el-form-item>-->
<!--            <el-form-item label="选择属性类型">-->
<!--                <el-select v-model="value.attributeId" v-if="goodsAttributeData" clearable>-->
<!--                    <el-option v-for="item in goodsAttributeData" :label="item.name" :key="item.id"-->
<!--                               :value="item.id"></el-option>-->
<!--                </el-select>-->
<!--            </el-form-item>-->
<!--            <el-form-item label="商品规格">-->
<!--                <el-card>-->
<!--                    <div v-if="value.property.length>0">-->
<!--                        <template v-for="item in value.property">-->
<!--                            <div style="display: flex;flex-direction: column">-->
<!--                                <label>{{item.name}}:</label>-->
<!--                                <el-checkbox-group v-if="item.selectModel===2" v-model="item.values">-->
<!--                                    <el-checkbox v-for="v in item.propertyList" :label="v" :key="v"></el-checkbox>-->
<!--                                </el-checkbox-group>-->
<!--                                <el-radio-group v-if="item.selectModel===1" v-model="item.values">-->
<!--                                    <el-radio v-for="v in item.propertyList" :label="v" :key="v"></el-radio>-->
<!--                                </el-radio-group>-->
<!--                            </div>-->
<!--                        </template>-->
<!--                        <el-table border :data="value.skuStockList" v-if="value.skuStockList.length>0">-->
<!--                            <el-table-column min-width="88px" v-for="item in value.property" :label="item.name"-->
<!--                                             :key="item.id">-->
<!--                                <template slot-scope="scope">-->
<!--                                    {{scope.row[item.name] ? scope.row[item.name]:''}}-->
<!--                                </template>-->
<!--                            </el-table-column>-->
<!--                            <el-table-column min-width="110px" label="销售价格">-->
<!--                                <template slot-scope="scope">-->
<!--                                    <el-input size="small" class="table-input" v-model="scope.row.price"/>-->
<!--                                </template>-->
<!--                            </el-table-column>-->
<!--                            <el-table-column min-width="88px" label="库存">-->
<!--                                <template slot-scope="scope">-->
<!--                                    <el-input size="small" class="table-input" v-model="scope.row.stock"/>-->
<!--                                </template>-->
<!--                            </el-table-column>-->
<!--                            <el-table-column min-width="110px" label="库存预警值">-->
<!--                                <template slot-scope="scope">-->
<!--                                    <el-input size="small" class="table-input" v-model="scope.row.stockAlarm"/>-->
<!--                                </template>-->
<!--                            </el-table-column>-->
<!--                            <el-table-column label="操作">-->
<!--                                <template slot-scope="scope">-->
<!--                                    <el-button size="small" type="primary"-->
<!--                                               @click="handlerDelItem(scope.$index)">删除-->
<!--                                    </el-button>-->
<!--                                </template>-->
<!--                            </el-table-column>-->
<!--                        </el-table>-->
<!--                    </div>-->
<!--                </el-card>-->
<!--            </el-form-item>-->
<!--            <el-form-item label="属性图片" v-if="value.propertyExt.length>0">-->
<!--                <el-card>-->
<!--                    <template v-for="item in value.propertyExt">-->
<!--                        <div class="property_pic">-->
<!--                            <label style="line-height: 1;margin-right: 20px">{{item.name}}:</label>-->
<!--                            <SingleUpload v-model="item[item.name]"></SingleUpload>-->
<!--                        </div>-->
<!--                    </template>-->
<!--                </el-card>-->
<!--            </el-form-item>-->
<!--            <el-form-item label="商品参数">-->
<!--                <el-card>-->
<!--                    <template v-if="value.skuParams.length>0" v-for="item in value.skuParams">-->
<!--                        <div class="card-params">-->
<!--                            <label class="lable">{{item.name}}</label>-->
<!--                            <el-select v-model="item.values" :multiple="item.selectModel===2" filterable clearable>-->
<!--                                <el-option v-for="v in item.propertyList" :value="v" :key="v" :label="v"></el-option>-->
<!--                            </el-select>-->
<!--                        </div>-->
<!--                    </template>-->
<!--                </el-card>-->
<!--            </el-form-item>-->
<!--        </el-form>-->
<!--    </div>-->
<!--</template>-->
<!--<style scoped>-->
<!--    .property_pic {-->
<!--        display: flex;-->
<!--    }-->
<!--</style>-->
<!--<script lang="ts">-->
<!--import RadioOrCheckBox from '@/components/RadioOrCheckBox.vue';-->
<!--import { Component, Vue, Prop, Watch } from 'vue-property-decorator';-->
<!--import api from '@/api/api';-->

<!--@Component({-->
<!--  components: { RadioOrCheckBox }-->
<!--})-->
<!--export default class StepTwo extends Vue {-->
<!--  @Prop() value: Goods;-->

<!--  goodsAttributeData: AttributeValue[] = [];-->

<!--  @Watch('value.attributeId')-->
<!--  handlerChangePropertyId(val: number[]) {-->
<!--    if (val) {-->
<!--      api.goodsProperty('get', { attributeId: val }).then((res: any) => {-->
<!--        this.value.property = res.data.filter((v: Property) => v.propertyType === 1).map((v: Property) => {-->
<!--          return {-->
<!--            ...v,-->
<!--            values: []-->
<!--          };-->
<!--        });-->
<!--        this.value.skuParams = res.data.filter((v: Property) => v.propertyType === 2).map((v: Property) => {-->
<!--          return {-->
<!--            ...v,-->
<!--            values: []-->
<!--          };-->
<!--        });-->
<!--      });-->
<!--    }-->
<!--  }-->

<!--  // 获取需要添加图片的属性-->
<!--  get picProperty() {-->
<!--    return this.value.property.filter((item: Property) => item.isPic).map((item: Property) => item.values);-->
<!--  }-->

<!--  handlerDelItem(index: number) {-->
<!--    this.value.skuStockList.splice(index, 1);-->
<!--  }-->

<!--  setData() {-->
<!--    api.goodsAttribute('get').then((res: any) => {-->
<!--      if (res.code === this.$global.HTTPS) {-->
<!--        this.goodsAttributeData = res.data;-->
<!--      }-->
<!--    });-->
<!--  }-->

<!--  getSorts() {-->
<!--      api.goodsSortManage('get').then((res:Common<any>)=>{-->
<!--        if(res.code===this.$global.HTTPS){-->

<!--        }-->
<!--      })-->
<!--  }-->

<!--  created() {-->
<!--    this.setData();-->
<!--    this.getSorts();-->
<!--  }-->

<!--  mounted() {-->
<!--  }-->
<!--}-->
<!--</script>-->

<!--<style lang="scss" scoped>-->
<!--    .card-params {-->
<!--        display: flex;-->
<!--        margin-bottom: 10px;-->

<!--        .lable {-->
<!--            display: inline-block;-->
<!--            width: 100px;-->
<!--        }-->
<!--    }-->

<!--</style>-->