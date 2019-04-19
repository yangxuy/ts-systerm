<template>
    <div>
        <el-upload
                action="string"
                :data="dataObj"
                list-type="picture-card"
                :file-list="fileList"
                :before-upload="beforeUpload"
                :on-remove="handleRemove"
                :on-success="handleUploadSuccess"
                :on-preview="handlePreview"
                :http-request="handlerSend">
            <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
    </div>
</template>

<script lang=ts>
import { Component, Vue, Prop } from 'vue-property-decorator'
import { imgSend } from '@/api/api';

@Component
export default class MulUpload extends Vue {
  @Prop() value: string[];

  get fileList() {
    if (this.value.length <= 0) {
      return []
    }
    return this.value.map((v) => {
      return {
        name: v.substr(this.value.lastIndexOf("/") + 1),
        url: v
      }
    })
  }

  emitInput(val: string[]) {
    this.$emit('input', val)
  }

  handlerSend(params: any) {
    const _file = params.file;
    const isLt2M = _file.size / 1024 / 1024 < 2;
    var formData = new FormData();
    formData.append("file", _file);

    if (!isLt2M) {
      this.$message.error("请上传2M以下的.xlsx文件");
      return false;
    }

    imgSend('post', formData).then((res: any) => {
      if (res.code === this.$global.HTTPS) {
        this.emitInput(res.data)
      }
    })
  }
}
</script>

<style scoped>

</style>