<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class RadioOrCheckBox extends Vue {
  @Prop() tem: string;
  @Prop() value: string;
  @Prop() child: Array<string>;

  select: any[] = [];

  handlerChangeSelect(v: any) {
    const index: number = this.select.indexOf(v.target.value)
    if (index > -1) {
      this.select.splice(index, 1);
    } else {
      this.select.push(v.target.value);
    }
    this.$emit('check-change', this.select)
  }

  render(createElement: any) {
    return createElement(`el-${this.tem}-group`, {
        props: { value: this.select }, nativeOn: {
          change: this.handlerChangeSelect
        }
      },
      this.child.map((v: string) => {
        return createElement(`el-${this.tem}`, {
          props: { label: v }
        })
      })
    )
  }
};
</script>

<style scoped>

</style>