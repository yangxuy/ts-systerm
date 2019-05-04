<template>
    <div>
        <el-upload
                class="avatar-uploader"
                list-type="picture-card"
                action="string"
                :show-file-list="false"
                :http-request="handlerSend">
            <img v-if="value" :src="baseUrl+'/'+value" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
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
export default class SingleUpload extends Vue {
    @Prop() value: string;
    dialogVisible: boolean = false;

    get baseUrl() {
        return process.env.VUE_APP_API_URL;
    }

    emitInput(val: any) {
        this.$emit('input', val);
    }

    handlerSend(params: any) {
        // this.$emit('input', 'http://pic37.nipic.com/20140113/8800276_184927469000_2.png')
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
                this.emitInput(res.data);
            }
        });
    }
}
</script>

<style>
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }

    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }

    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        text-align: center;
    }

    .avatar {
        width: 100%;
        height: 100%;
        display: block;
    }
</style>