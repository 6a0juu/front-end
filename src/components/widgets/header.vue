<template>
    <div class="header">
        <div class="logo">学生信息管理系统</div>
        <div class="header-right">
            <div class="header-user-con">
                <!-- 用户头像 -->
                <div class="user-avator"><img src="../../assets/logo.png"></div>
                <!-- 用户名下拉菜单 -->
                <el-dropdown class="user-name" @command="handleCommand">
                    <span class="el-dropdown-link">
                        {{username}} <i class="el-icon-caret-bottom"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item  command="edtuser">修改信息</el-dropdown-item>
                        <el-dropdown-item  command="about">关于作者</el-dropdown-item>
                        <el-dropdown-item divided  command="loginout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
        <!--
        <el-dialog title="用户信息编辑" :visible.sync="edtVisible" width="30%">
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="用户名">
                    <el-input v-model="form.username"></el-input>
                </el-form-item>
                <el-form-item label="密码">
                    <el-input v-model="form.password"></el-input>
                </el-form-item>
                <dir></dir>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="edtVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdt">确 定</el-button>
            </span>
        </el-dialog>
        -->
    </div>
</template>
<script>
    export default {
        
        data() {
            return {
                aboutVisible: false,
                edtVisible: false,
                name: 'butTst',
                message: 2
            }
        },
        computed:{
            username(){
                let username = localStorage.getItem('ms_username');
                return username ? username : this.name;
            }
        },
        methods:{
            // 用户名下拉菜单选择事件
            handleCommand(command) {
                if(command == 'loginout'){
                    localStorage.removeItem('ms_username')
                    localStorage.removeItem('tstToken')
                    this.$router.push('/login');
                } else if(command == "edtuser"){
                    //this.$router.push('/');
                } else if(command == "about"){

                }
            },
            saveEdt(){
                this.url = 'http://localhost:19845/api/user';
                this.$axios.put(this.url, {
                    Username: this.form.username,
                    Password: this.form.password
                }).then((res) => {
                    this.$set(this.tableData, this.idx, this.form);
                    this.edtVisible = false;
                    this.$message.success(`修改成功`);
                }, (err) => {
                    this.$message.error(`修改失败`);
                });
            }

        }
        
    }
</script>
<style scoped>
    .header {
        position: relative;
        box-sizing: border-box;
        width: 100%;
        height: 70px;
        font-size: 22px;
        color: #fff;
    }
    .collapse-btn{
        float: left;
        padding: 0 21px;
        cursor: pointer;
        line-height: 70px;
    }
    .header .logo{
        float: left;
        width:250px;
        line-height: 70px;
    }
    .header-right{
        float: right;
        padding-right: 50px;
    }
    .header-user-con{
        display: flex;
        height: 70px;
        align-items: center;
    }
    .btn-fullscreen{
        transform: rotate(45deg);
        margin-right: 5px;
        font-size: 24px;
    }
    .btn-bell, .btn-fullscreen{
        position: relative;
        width: 30px;
        height: 30px;
        text-align: center;
        border-radius: 15px;
        cursor: pointer;
    }
    .btn-bell-badge{
        position: absolute;
        right: 0;
        top: -2px;
        width: 8px;
        height: 8px;
        border-radius: 4px;
        background: #f56c6c;
        color: #fff;
    }
    .btn-bell .el-icon-bell{
        color: #fff;
    }
    .user-name{
        margin-left: 10px;
    }
    .user-avator{
        margin-left: 20px;
    }
    .user-avator img{
        display: block;
        width:40px;
        height:40px;
        border-radius: 50%;
    }
    .el-dropdown-link{
        color: #fff;
        cursor: pointer;
    }
    .el-dropdown-menu__item{
        text-align: center;
    }

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
