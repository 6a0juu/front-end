<template>
    <div class="login-wrap">
        <div class="ms-title">后台管理系统</div>
        <div class="ms-login">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="demo-ruleForm">
                
                <el-radio-group v-model="radio3">
                    <div class="sign-inup">
                    <el-radio-button label="登录"></el-radio-button>
                    <el-radio-button label="注册"></el-radio-button>
                    </div>
                </el-radio-group>
                <span style="line-height:18px;"></span>
                <el-form-item prop="username">
                    <el-input v-model="ruleForm.username" placeholder="username"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="password" v-model="ruleForm.password" @keyup.enter.native="submitForm('ruleForm')"></el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
                </div>
                <p style="font-size:12px;line-height:30px;color:#999;">Tips: 默认为管理员账号，其他账号请自行注册。</p>
            </el-form>
        </div>
    </div>
</template>

<script>
    export default {
        data: function(){
            return {
                radio3: '登录',
                ruleForm: {
                    username: 'bjwdttz',
                    password: 'bjwdttz'
                },
                rules: {
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            submitForm(ruleForm) {
                if (this.radio3 == '登录') {
                    this.$axios.post('http://167.99.170.198:19845/api/login', {
                        Usnm: this.ruleForm.username,
                        Pswd: this.ruleForm.password
                    }).then((res) => {
                        // success
                        console.log(res)
                        if (res.status == 200) {
                            this.$message.success("登录成功")
                            localStorage.setItem('ms_username', this.ruleForm.username);
                            localStorage.setItem('tstToken', res.data.meta.token);
                            this.$router.push('/');
                        }
                    }, (error) => {
                        // error
                        this.$message.error("用户名或密码错误")
                        console.log(error)
                    });
                } else if (this.radio3 == '注册') {
                    this.$axios.post('http://167.99.170.198:19845/api/user', {
                        Usnm: this.ruleForm.username,
                        Pswd: this.ruleForm.password
                    }).then((res) => {
                        // success
                        console.log(res)
                        this.$message.success("注册成功")
                    }, (error) => {
                        // error
                        this.$message.error("注册失败")
                        console.log(error)
                    });
                }
                
            }
        }
    }
</script>

<style scoped>
    .login-wrap{
        position: relative;
        width:100%;
        height:100%;
    }
    .ms-title{
        position: absolute;
        top:50%;
        width:100%;
        margin-top: -230px;
        text-align: center;
        font-size:30px;
        color: #fff;

    }
    .sign-inup{
        width: 300px; 
        margin-bottom: 20px;
        text-align: center;
        align-self: center;
    }
    .ms-login{
        position: absolute;
        left:50%;
        top:50%;
        width:300px;
        height:200px;
        margin:-150px 0 0 -190px;
        padding:40px;
        border-radius: 5px;
        background: #fff;
    }
    .login-btn{
        text-align: center;
    }
    .login-btn button{
        width:100%;
        height:36px;
    }
</style>