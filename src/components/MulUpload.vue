<template>
    <div>
        <el-upload
                action="string"
                list-type="picture-card"
                :file-list="fileList"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove"
                :http-request="handlerSend">
            <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible" :append-to-body="true">
            <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
    </div>
</template>

<script lang=ts>
interface File {
  name: string;
  url: string;
}

import { Component, Vue, Prop } from 'vue-property-decorator';
import { imgSend } from '@/api/api';

@Component
export default class MultipleUpload extends Vue {
  @Prop() value: string;
  dialogVisible: boolean = false;
  dialogImageUrl: string = '';

  get baseUrl() {
    return process.env.VUE_APP_API_URL;
  }

  get fileList() {
    if (this.value) {
      return this.value.split(',').map((v) => {
        return {
          url: this.baseUrl + '/' + v
        };
      });
    }
    return [];

    // const fileList = [];
    // for (let i = 0; i < this.value.length; i++) {
    //     fileList.push({ url: this.baseUrl + '/' + this.value[i] });
    // }
    // return fileList;
  }

  handlePictureCardPreview(file: any) {
    this.dialogImageUrl = file.url;
    this.dialogVisible = true;
  }

  handleRemove(file: File) {
    this.value.slice(this.value.indexOf(file.url), 1);
  }

  handlerSend(params: any) {
    const _file = params.file;
    const isLt2M = _file.size / 1024 / 1024 < 2;
    var formData = new FormData();
    formData.append('file', _file);

    if (!isLt2M) {
      this.$message.error('请上传2M以下的.xlsx文件');
      return false;
    }

    imgSend('post', formData).then((res: Common<any>) => {
      if (res.code === this.$global.HTTPS) {
        // this.value.push(res.data);
        const str = this.value ? this.value + ',' + res.data : this.value + '' + res.data;
        // this.value += this.value ? ',' + res.data : res.data;
        this.$emit('input', str);
      }
    });
  }
}
</script>

<style scoped>

</style>
