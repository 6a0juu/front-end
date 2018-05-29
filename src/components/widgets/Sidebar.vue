<template>
    <div class="sidebar">
        <el-menu class="sidebar-el-menu" :default-active="onRoutes" background-color="#324157"
            text-color="#bfcbd9" active-text-color="#20a0ff" unique-opened router>
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index" :key="item.index">
                        <template slot="title">
                            <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
                        </template>
                        <el-menu-item v-for="(subItem,i) in item.subs" :key="i" :index="subItem.index">
                            {{ subItem.title }}
                        </el-menu-item>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index">
                        <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                items: [
                    {
                        icon: 'el-icon-tickets',
                        index: 'table',
                        title: '数据表格'
                    },
                    {
                        icon: 'el-icon-date',
                        index: '3',
                        title: '表单相关',
                        subs: [
                            {
                                index: 'upload',
                                title: '批量导入'
                            },
                            {
                                index: 'download',
                                title: '批量导出'
                            }
                        ]
                    },
                    {
                        icon: 'el-icon-warning',
                        index: 'usertable',
                        title: '用户表格'
                    }
                ]
            }
        },
        computed:{
            onRoutes(){
                return this.$route.path.replace('/','');
            }
        },
    }
</script>

<style scoped>
    .sidebar{
        display: block;
        position: absolute;
        left: 0;
        top: 70px;
        bottom:0;
    }
    .sidebar-el-menu{
        width: 250px;
    }
    .sidebar > ul {
        height:100%;
    }
</style>
