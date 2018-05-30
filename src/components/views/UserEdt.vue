<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-warning"></i> 用户</el-breadcrumb-item>
                <el-breadcrumb-item>修改信息</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="用户名">
                    <el-input v-model="form.usnm"></el-input>
                </el-form-item>
                <el-form-item label="密码">
                    <el-input v-model="form.pswd"></el-input>
                </el-form-item>
                <dir></dir>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button >取 消</el-button>
                <el-button type="primary" @click="saveEdt">确 定</el-button>
            </span>
        </div>
    </div>
</template>



<script>
    export default {
        data() {
            return {
                edtVisible: true,
                form: {
                    usnm: '',
                    pswd: ''
                },
            }
        },
                
        methods:{
            saveEdt(){
                this.url = 'http://localhost:19845/api/user';
                this.$axios.put(this.url, {
                    Usnm: this.form.usnm,
                    Pswd: this.form.pswd
                }).then((res) => {
                    this.$set(this.tableData, this.idx, this.form);
                    this.$message.success(`修改成功`);
                    this.$router.push('/useredt');
                }, (err) => {
                    this.$message.error(`修改失败`);
                });
            }
        }
    }
</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }
    .handle-select {
        width: 120px;
    }
    .handle-input {
        width: 180px;
        display: inline-block;
    }
    .del-dialog-cnt{
        font-size: 16px;
        text-align: center
    }
</style>