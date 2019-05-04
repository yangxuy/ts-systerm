<template>
    <section class="swiper-box"
             :style="getCustomStyle"
             @mouseenter.stop="handleMouseEnter"
             @mouseleave.stop="handleMouseLeave">
        <slot></slot>
        <div class="indicator-box" v-if="showIndicator">
            <ul class="indicator-ul">
                <li class="indicator-li"
                    v-for="index in children.length" @click.stop="setActiveIndex(index-1)">
                    <span :class="[index-1===activeIndex?'animationName':'','default-indicator']"
                          :style="[index-1===activeIndex?baseStyles:'']"> </span>
                </li>
            </ul>
        </div>
    </section>
</template>

<script lang=ts>
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';

@Component
export default class Swiper extends Vue {
  @Prop({ type: Boolean }) showIndicator: boolean; // 是否需要指示器
  @Prop({ type: [String, Number] }) height: string | number;
  @Prop({ type: [String, Number] }) width: string | number;
  @Prop({ type: Number, default: 5000 }) duration: number; // 轮播时间
  @Prop() type: string; // 轮播
  @Prop({ type: Boolean, default: true }) loop: boolean; // 轮播方式
  @Prop({ type: Boolean, default: false }) autoplay: boolean; // 轮播方式
  activeIndex: number = -1; // 激活的index
  children: Vue[] = [];
  timer: number = 0;
  hover: boolean = false;

  get getCustomStyle() {
    let style = {};
    if (this.height) {
      style = Object.assign({}, style, { height: typeof this.height === 'number' ? this.height + 'px' : this.height });
    }
    if (this.width) {
      style = Object.assign({}, style, { width: typeof this.width === 'number' ? this.width + 'px' : this.width });
    }
    return style;
  }

  @Watch('activeIndex')
  handlerActiveIndex(val: number, old: number) {
    this.children.forEach((item, index) => {
      // @ts-ignore
      item.translateItem(index, val, old);
    });
  }

  get baseStyles() {
    const style = {
      animationDuration: `${this.duration / 1000}s`,
      animationTimingFunction: 'linear',
      animationPlayState: this.hover ? 'paused' : 'running'
    };
    return style;
  }

  // 取消定时器，停止轮播
  pauseTimer() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  // slide left
  playSlides() {
    if (this.activeIndex < this.children.length - 1) {
      this.activeIndex++;
    } else if (this.loop) {
      this.activeIndex = 0;
    }
  }

  setActiveIndex(index: number) {
    this.activeIndex = index;
  }

  startTimer() {
    clearInterval(this.timer);
    this.timer = setInterval(this.playSlides, this.duration);
  }

  // 左右控制
  throttledArrowClick(index: number) {
    const length = this.children.length;
    if (index >= length) {
      this.activeIndex = this.loop ? 0 : length - 1;
    } else if (index < 0) {
      this.activeIndex = this.loop ? length - 1 : 0;
    } else {
      this.activeIndex = index;
    }
  }

  handleMouseEnter() {
    this.hover = true;
    this.pauseTimer();
  }

  handleMouseLeave() {
    this.hover = false;
    this.startTimer();
  }

  mounted() {
    this.children = this.$children.filter((child: Vue) => child.$options.name === 'Slide');
    this.$nextTick(() => {
      this.playSlides();
      this.autoplay ? this.startTimer() : this.pauseTimer();
    });
  }

  beforeDestroy() {
    this.pauseTimer();
  }
}
</script>

<style scoped>
    @keyframes anim1 {
        0% {
            width: 0;
        }
        100% {
            width: 40px;
        }
    }

    .swiper-box {
        position: relative;
        height: 415px;
        width: 100%;
    }

    .indicator-box {
        position: absolute;
        width: 100%;
        bottom: 10px;
    }

    .indicator-ul {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .indicator-li {
        width: 40px;
        height: 4px;
        margin: 0 10px;
        background: rgba(0, 0, 0, 0.5);
        position: relative;
    }

    .default-indicator {
        position: absolute;
        top: 0;
        bottom: 0;
        display: inline-block;
        background: white;

    }

    .animationName {
        animation-name: anim1;
    }

</style>
