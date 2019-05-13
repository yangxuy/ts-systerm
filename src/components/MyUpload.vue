<template>
    <div class="input-box">
        <el-button class="upload-but" type="primary" size="small" @click="handlerOpenFile">点击上传</el-button>
        <input class="input-file" type="file" ref="my-upload" @change="handlerSubmit"></input>
        <div class="icon-box">
            <i class="el-icon-zoom-in check-icon added" @click.stop="handlerCheck"></i>
            <i class="el-icon-edit check-icon deled" @click.stop="handlerOpenFile"></i>
        </div>
        <el-dialog :visible.sync="dialogVisible" :append-to-body="true">
            <img width="100%" :src="baseUrl+'/'+value" alt="">
        </el-dialog>
    </div>
</template>

<script lang=ts>
import { Component, Vue, Prop } from 'vue-property-decorator';
import { imgSend } from '@/api/api';

@Component
export default class MyUpload extends Vue {
  @Prop() value: string;
  dialogVisible: boolean = false;
  $refs: {
    'my-upload': any
  };

  get baseUrl() {
    return process.env.VUE_APP_API_URL;
  }

  handlerOpenFile() {
    const oInput = this.$refs['my-upload'];
    oInput.click();
  }

  handlerSubmit(file: any) {
    const _file = file.target.files[0];
    const isLt2M = _file.size / 1024 / 1024 < 2;
    var formData = new FormData();
    formData.append('file', _file);

    if (!isLt2M) {
      this.$message.error('请上传2M以下的.xlsx文件');
      return false;
    }

    imgSend('post', formData).then((res: Common<any>) => {
      if (res.code === this.$global.HTTPS) {
        this.$message.success(res.message);
        this.$emit('input', res.data);
      }
    });
  }

  handlerCheck() {
    this.dialogVisible = true;
  }
}
</script>

<style lang="scss" scoped>
    .input-box {
        position: relative;
    }

    .input-box:hover {
        .icon-box {
            visibility: visible;
            color: white;
        }
    }

    .input-file {
        visibility: hidden;
        position: absolute;
        top: 0;
    }

    .icon-box {
        top: 0;
        bottom: 0;
        visibility: hidden;
        width: 100%;
        display: flex;
        justify-content: space-around;
        align-items: center;
        background-color: rgba(0, 0, 0, 0.7);
        position: absolute;
    }

    .upload-but {
    }
</style>