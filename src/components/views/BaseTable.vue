
<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i> 基础表格</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="delete" class="handle-del mr10" @click="handleAdd">新增条目</el-button>
                <el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button>
            </div>
            <div class="handle-box">
                <el-input v-model="select_sid" placeholder="筛选学号" class="handle-input mr10"></el-input>
                <el-input v-model="select_name" placeholder="筛选姓名" class="handle-input mr10"></el-input>
                <el-input v-model="select_email" placeholder="筛选电子邮件" class="handle-input mr10"></el-input>
                <el-input v-model="select_tel" placeholder="筛选电话" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="search" @click="search">搜索</el-button>
            </div>
            <el-table :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)" stripe style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="sid" label="学号" sortable width="170"></el-table-column>
                <el-table-column prop="name" label="姓名" sortable width="140"> </el-table-column>
                <el-table-column prop="email" label="电子邮件" sortable width="200"></el-table-column>
                <el-table-column prop="tel" label="电话" sortable width="170"> </el-table-column>
                <el-table-column label="操作" width="200">
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
                <el-form-item label="学号">
                    <el-input v-model="form.sid"></el-input>
                </el-form-item>
                <el-form-item label="姓名">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="电子邮件">
                    <el-input v-model="form.email"></el-input>
                </el-form-item>
                <el-form-item label="电话">
                    <el-input v-model="form.tel"></el-input>
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
                <el-form-item label="学号">
                    <el-input v-model="form.sid"></el-input>
                </el-form-item>
                <el-form-item label="姓名">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="电子邮件">
                    <el-input v-model="form.email"></el-input>
                </el-form-item>
                <el-form-item label="电话">
                    <el-input v-model="form.tel"></el-input>
                </el-form-item>
                <el-form-item label="原学号">
                    <el-input v-model="form.orisid" :disabled="true"></el-input>
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
                    email: '10123214924@qq.com',
                    name: 'orz',
                    sid: '2014233310312',
                    tel: '12345678901'
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
                    email: '',
                    name: '',
                    sid: '',
                    tel: ''
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
                this.url = 'https://sims-demo.me/api/all';
                this.$axios.get(this.url).then((res) => {
                    if (Math.random() > 0.5) {
                        this.tableData = res.data.splice(1,5)
                    }
                    else {
                        this.tableData = res.data.splice(6,4)
                    }
                    //console.log(res)
                })
            },
            search() {
                this.is_search = true;
                this.url = 'https://sims-demo.me/api/form';
                this.$axios.post(this.url, {
                    SID: this.select_sid,
                    Name: this.select_name,
                    Email: this.select_email,
                    Tel: this.select_tel,
                }).then((res) => {
                    //console.log(res.data)
                    if (res.data == null) {
                        this.$message.error(`搜索失败`);
                    } else {
                        this.tableData = res.data;
                        this.$message.success(`搜索成功`);
                    }
                    
                }, (err) => {
                    this.$message.error(`搜索失败`);
                });
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
                    sid: item.sid,
                    name: item.name,
                    email: item.email,
                    tel: item.tel,
                    orisid: item.sid
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
                //this.del_list = this.del_list.concat(this.multipleSelection);//这里加入删除表
                for (let i = 0; i < length; i++) {
                    this.url = 'https://sims-demo.me/api/itemdel';
                    //console.log(this.tableData[this.idx])
                    this.$axios.put(this.url, {
                        SID: this.multipleSelection[i].sid,
                        Name: this.multipleSelection[i].name,
                        Email: this.multipleSelection[i].email,
                        Tel: this.multipleSelection[i].tel
                    }).then((res) => {
                        this.tableData.splice(this.idx, 1);
                        this.$message.success('删除成功');
                        this.delVisible = false;
                    }, (err) => {
                        this.$message.error('删除失败');
                    });
                }
                this.$message.success('删除了' + length + '条');
                this.multipleSelection = [];
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            // 保存编辑
            saveEdit() {
                this.url = 'https://sims-demo.me/api/item';
                this.$axios.put(this.url, {
                    SID: this.form.sid,
                    Name: this.form.name,
                    Email: this.form.email,
                    Tel: this.form.tel,
                    OriSID: this.form.orisid
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
                this.url = 'https://sims-demo.me/api/itemdel';
                console.log(this.tableData[this.idx])
                this.$axios.put(this.url, {
                    SID: this.tableData[this.idx].sid,
                    Name: this.tableData[this.idx].name,
                    Email: this.tableData[this.idx].email,
                    Tel: this.tableData[this.idx].tel
                }).then((res) => {
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
                this.url = 'https://sims-demo.me/api/item';
                this.$axios.post(this.url, {
                    SID: this.form.sid,
                    Name: this.form.name,
                    Email: this.form.email,
                    Tel: parseInt(this.form.tel)
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
