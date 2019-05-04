<template>
    <div class="index">
        <!--        <div id="echart" style="width: 100%;height: 400px"></div>-->
        <Swiper autoplay showIndicator height="415px">
            <Slide>
                <img src="https://pic-1256941443.file.myqcloud.com/show/1556260740457228349.jpeg">
            </Slide>
            <Slide>
                <img src="https://pic-1256941443.file.myqcloud.com/show/1556503821470977187.jpeg">
            </Slide>
            <Slide>
                <img src="https://pic-1256941443.file.myqcloud.com/show/1556190433501897603.jpeg">
            </Slide>
        </Swiper>
    </div>
</template>

<script lang="ts">
// @ts-ignore
import echarts from 'echarts/lib/echarts';

import 'echarts/lib/component/title';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/grid';

import 'echarts/lib/chart/line';
import 'echarts/lib/chart/bar';
import { Component, Vue } from 'vue-property-decorator';

import ECharts = echarts.ECharts;
import EChartOption = echarts.EChartOption;

import Swiper from '@/components/Swiper.vue';
import Slide from '@/components/Slide.vue';

@Component({
  components: {
    Swiper,
    Slide
  }
})
export default class Index extends Vue {

  setEchart() {
    const myChart: ECharts = echarts.init(document.getElementById('echart'));

    // 指定图表的配置项和数据
    const option: EChartOption = {
      title: {
        text: 'ECharts 入门示例',
        show: true,
        textStyle: {
          color: '#aaa',
          fontSize: 16
        },
        // subtext: '副标题',
        textAlign: 'auto'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        }
      },
      legend: {
        data: [{
          name: '销量',
          icon: 'rect'
        }],
        show: true
        // shadowColor: 'green',
        // borderWidth: 2,
        // borderColor: 'yellow',
        // borderRadius: [5, 5, 0, 0],
        // shadowBlur: 10,
        // shadowOffsetX: 10,
        // shadowOffsetY: 10,
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
        show: false
      },
      xAxis: {
        name: '商品',
        data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
      },
      yAxis: {
        name: '数量'
      },
      series: [{
        name: '销量',
        type: 'bar',
        data: [5, 20, 36, 10, 10, 20]
      }]
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
  }

  mounted() {
    // this.setEchart();
  }
}
</script>

<style scoped>
    img {
        height: 100%;
    }
</style>