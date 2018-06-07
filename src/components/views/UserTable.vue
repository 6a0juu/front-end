
<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-warning"></i> 用户表格</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="delete" class="handle-del mr10" @click="handleAdd">新增条目</el-button>
                <el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button>
            </div>
            <el-table :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)" stripe style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="usnm" label="用户名" sortable width="200"></el-table-column>
                <el-table-column prop="pswd" label="密码" sortable width="200"> </el-table-column>
                <el-table-column label="操作" width="250">
                    <template slot-scope="scope">
                        <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination 
                    @current-change="handleCurrentChange" 
                    :current-page="currentPage" 
                    layout="total, prev, pager, next, jumper"
                    :page-size="pagesize"
                    :total="tableData.length">
                </el-pagination>
            </div>
        </div>

        <!-- 新增弹出框 -->
        <el-dialog title="新增" :visible.sync="addVisible" width="30%">
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
                <el-button @click="addVisible = false">取 消</el-button>
                <el-button type="primary" @click="addOne">确 定</el-button>
            </span>
        </el-dialog>


        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="用户名">
                    <el-input v-model="form.usnm" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="密码">
                    <el-input v-model="form.pswd"></el-input>
                </el-form-item>
                <dir></dir>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 删除提示框 -->
        <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteRow">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                
                currentPage:1,
                pagesize:10,
                url: '',
                tableData: [{
                    usnm: 'qwq',
                    pswd: 'qwq'
                }],
                multipleSelection: [],
                select_cate: '',
                select_sid: '',
                select_name: '',
                select_email: '',
                select_tel: '',
                del_list: [],
                is_search: false,
                editVisible: false,
                delVisible: false,
                addVisible: false,
                form: {
                    usnm: '',
                    pswd: ''
                },
                idx: -1
            }
        },
        created() {

            // 切换到该页面时的执行函数
            this.getData();
        },
        computed: {
            data() {
                return this.tableData
            }
        },
        methods: {

            handleCurrentChange: function(currentPage){
                this.currentPage = currentPage;
            },
            getData() {
                this.url = 'https://sims-demo.me/api/user';
                this.$axios.get(this.url).then((res) => {
                    this.tableData = res.data;
                })
            },
            formatter(row, column) {
                return row.address;
            },
            filterTag(value, row) {
                return row.tag === value;
            },
            handleEdit(index, row) {
                this.idx = index;
                const item = this.tableData[index];
                this.form = {
                    usnm: item.usnm,
                    pswd: item.pswd
                }
                this.editVisible = true;
            },
            handleDelete(index, row) {
                this.idx = index;
                this.delVisible = true;
            },
            delAll() {
                const length = this.multipleSelection.length;
                let str = '';
                this.del_list = this.del_list.concat(this.multipleSelection);
                for (let i = 0; i < length; i++) {
                    str += this.multipleSelection[i].name + ' ';
                    console.log()
                }
                this.$message.error('删除了' + str);
                this.multipleSelection = [];
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            // 保存编辑
            saveEdit() {
                this.url = 'https://sims-demo.me/api/user';
                this.$axios.put(this.url, {
                    Usnm: this.form.usnm,
                    Pswd: this.form.pswd
                }).then((res) => {
                    this.$set(this.tableData, this.idx, this.form);
                    this.editVisible = false;
                    this.$message.success(`修改成功`);
                }, (err) => {
                    this.$message.error(`修改失败`);
                });
                
            },
            // 确定删除
            deleteRow(){
                this.url = 'https://sims-demo.me/api/user';
                this.$axios.delete(this.url + '?Usnm=' + this.this.tableData[this.idx].usnm).then((res) => {
                    this.tableData.splice(this.idx, 1);
                    this.$message.success('删除成功');
                    this.delVisible = false;
                }, (err) => {
                    this.$message.error('删除失败');
                });
            },
            handleAdd(){
                
                this.addVisible = true;
            },
            addOne(){
                this.url = 'https://sims-demo.me/api/user';
                this.$axios.post(this.url, {
                    Usnm: this.form.usnm,
                    Pswd: this.form.pswd
                }).then((res) => {
                    this.tableData.push(this.form)
                    this.addVisible = false;
                    this.$message.success('添加成功');
                }, (err) => {
                    this.$message.error('添加失败');
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
