<template>
    <div>
        <el-form label-width="100px">
            <!--            <el-form-item label="商品分类">-->
            <!--                <el-select>-->
            <!--                    <el-option v-for="item in goodsSort" :value="item.id" :label="item.name" :key="item.id"></el-option>-->
            <!--                </el-select>-->
            <!--            </el-form-item>-->
            <el-form-item label="商品名称">
                <el-input v-model="value.name"></el-input>
            </el-form-item>
        </el-form>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { goodsSortManage } from '@/api/api';

@Component
export default class StepOne extends Vue {
  @Prop() value: Goods;
  goodsSort: Sorts[] = [];

  setData() {
    goodsSortManage('get').then((res: any) => {
      this.goodsSort = res.data
    })
  }

  mounted() {
    this.setData()
  }
}
</script>

<style scoped>

</style>