<template>
    <LoadingBox :loading="false">

    </LoadingBox>
</template>

<script lang=ts>
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class OrderList extends Vue {
    loading: boolean = false;
}
</script>

<style scoped>

</style>