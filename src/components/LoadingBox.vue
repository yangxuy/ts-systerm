<template>
    <div class="loading-box"
         v-loading.fullscreen="loading"
         element-loading-text="拼命加载中"
         element-loading-spinner="el-icon-loading"
         element-loading-background="rgba(0, 0, 0, 0.8)">
        <slot></slot>
    </div>
</template>

<script lang="ts">
import { Component, Vue,Prop } from 'vue-property-decorator';

@Component
export default class LoadingBox extends Vue {
  @Prop({type:Boolean,default:false}) loading:boolean;
}
</script>

<style scoped>

</style>