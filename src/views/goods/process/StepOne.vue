<!--<template>-->
<!--    <div class="border">-->
<!--        <el-form :model="value" ref="goodsStepOne" label-width="100px">-->
<!--            <el-form-item label="商品名称" prop="name" :rules="rules.NotEmpty">-->
<!--                <el-input size="small" v-model="value.name"></el-input>-->
<!--            </el-form-item>-->
<!--            <el-form-item label="所属品牌">-->
<!--                <el-select size="small" v-model="value.brandId">-->
<!--                    <el-option v-for="item in goodsBrand" :key="item.id" :value="item.id"-->
<!--                               :label="item.name"></el-option>-->
<!--                </el-select>-->
<!--            </el-form-item>-->
<!--            <el-form-item label="副标题">-->
<!--                <el-input size="small" v-model="value.subHead"></el-input>-->
<!--            </el-form-item>-->
<!--            <el-form-item label="描述">-->
<!--                <el-input type="textarea" size="small" v-model="value.summary"></el-input>-->
<!--            </el-form-item>-->
<!--            <el-form-item label="货号">-->
<!--                <el-input size="small" v-model="value.itemNum"></el-input>-->
<!--            </el-form-item>-->
<!--            <el-form-item label="排序">-->
<!--                <el-input size="small" v-model.number="value.orderNum"></el-input>-->
<!--            </el-form-item>-->
<!--            <el-form-item label="商品图片">-->
<!--                <MulUpload v-model="value.pictures"></MulUpload>-->
<!--            </el-form-item>-->
<!--        </el-form>-->
<!--    </div>-->
<!--</template>-->

<!--<script lang="ts">-->
<!--import rules from '@/utils/rules';-->
<!--import MulUpload from '@/components/MulUpload.vue';-->
<!--import { Component, Vue, Prop } from 'vue-property-decorator';-->
<!--import api from '@/api/api';-->

<!--@Component({-->
<!--    components: { MulUpload }-->
<!--})-->
<!--export default class StepOne extends Vue {-->
<!--    @Prop() value: Goods;-->
<!--    rules: Rules = rules;-->
<!--    goodsSort: Sorts[] = [];-->
<!--    goodsBrand: Brand[] = [];-->

<!--    setData() {-->
<!--        api.goodsSortManage('get').then((res: any) => {-->
<!--            this.goodsSort = res.data;-->
<!--        });-->
<!--    }-->

<!--    getBrand() {-->
<!--        api.goodsBrandManage('get').then((res: Common<Brand[]>) => {-->
<!--            if (res.code === this.$global.HTTPS) {-->
<!--                this.goodsBrand = res.data;-->
<!--            }-->
<!--        });-->
<!--    }-->

<!--    created() {-->
<!--        this.getBrand();-->
<!--    }-->

<!--    mounted() {-->
<!--        this.setData();-->
<!--    }-->
<!--}-->
<!--</script>-->

<!--<style scoped>-->

<!--</style>-->