<template>
    <div :class="[ready?'activeIndex':'','slide-box']">
        <slot/>
    </div>
</template>

<script lang=ts>
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Slide extends Vue {
  ready: boolean = false;

  clickSlide() {

  }

  translateItem(index: number, activeIndex: number, oldIndex: number) {
    if (activeIndex === index) {
      this.ready = true;
    } else {
      this.ready = false;
    }
  }
}
</script>

<style scoped>
    .slide-box {
        height: 100%;
        position: absolute;
        width: 100%;
        opacity: 0;
    }

    .activeIndex {
        opacity: 1;
        /*transition: opacity 0.5s;*/
    }
</style>
