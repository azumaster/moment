<template>
    <div class="page-table">
        <Table :columns="userColumn" :data="userList"></Table>
    </div>
</template>

<script>
    export default {
        name: 'userList',
        data () {
            return {
                userColumn: [{title: '姓名', key: 'name'}, {title: '年龄', key: 'age'}, {title: '地址', key: 'address'}],
                userList: []
            };
        },
        methods: {
            getUserList: function () {
                let _this = this;

                this.$Loading.start();
                this.$ajax({
                    method: 'get',
                    url: '/user/getUserList'
                }).then(function (res) {
                    if(res.data.code == 0){
                        _this.userList = res.data.data.list;
                    }else{
                        _this.$Message.error(res.data.message);
                    }
                    _this.$Loading.finish();
                }).catch(function () {
                    _this.$Message.error('小Mo开小差去了，请稍后再试~');
                    _this.$Loading.error();
                });
            }
        },
        created: function(){
            this.getUserList();
        }
    };
</script>