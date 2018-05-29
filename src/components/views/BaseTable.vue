
<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i> 基础表格</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button>
                <el-select v-model="select_cate" placeholder="筛选省份" class="handle-select mr10">
                    <el-option key="1" label="广东省" value="广东省"></el-option>
                    <el-option key="2" label="湖南省" value="湖南省"></el-option>
                </el-select>
                <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="search" @click="search">搜索</el-button>
            </div>
            <el-table :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)" stripe style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="sid" label="学号" sortable width="180"></el-table-column>
                <el-table-column prop="name" label="姓名" sortable width="100"> </el-table-column>
                <el-table-column prop="email" label="电子邮件" sortable width="180"></el-table-column>
                <el-table-column prop="tel" label="电话" sortable width="150"> </el-table-column>
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
                select_word: '',
                del_list: [],
                is_search: false,
                editVisible: false,
                delVisible: false,
                form: {
                    name: '',
                    date: '',
                    address: ''
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
                return this.tableData.filter((d) => {
                    let is_del = false;
                    for (let i = 0; i < this.del_list.length; i++) {
                        if (d.name === this.del_list[i].name) {
                            is_del = true;
                            break;
                        }
                    }
                    if (!is_del) {
                        if (d.address.indexOf(this.select_cate) > -1 &&
                            (d.name.indexOf(this.select_word) > -1 ||
                                d.address.indexOf(this.select_word) > -1)
                        ) {
                            return d;
                        }
                    }
                })
            }
        },
        methods: {

            handleCurrentChange: function(currentPage){
                this.currentPage = currentPage;
            },
            getData() {
                this.url = 'http://localhost:19845/api/all';
                this.$axios.get(this.url).then((res) => {
                    this.tableData = res.data;
                    //console.log(res)
                })
            },
            search() {
                this.is_search = true;
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
                this.del_list = this.del_list.concat(this.multipleSelection);
                for (let i = 0; i < length; i++) {
                    str += this.multipleSelection[i].name + ' ';
                }
                this.$message.error('删除了' + str);
                this.multipleSelection = [];
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            // 保存编辑
            saveEdit() {
                this.url = 'http://localhost:19845/api/item';
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
                this.url = 'http://localhost:19845/api/itemdel';
                console.log(this.tableData[this.idx].sid)
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
                    this.$message.error(`删除失败`);
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
        width: 300px;
        display: inline-block;
    }
    .del-dialog-cnt{
        font-size: 16px;
        text-align: center
    }
</style>
