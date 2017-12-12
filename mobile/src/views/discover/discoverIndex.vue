<template>
    <div class="page-wrap">
        <div class="discover-list">
            <div class="discover-item" v-for="(blog, index) in blogList" :key="blog._id">
                <div class="discover-item-head">
                    <div class="user-head"><img :src="blog.author.head"></div>
                    <div class="user-info">
                        <p class="user-info-name">{{blog.author.name}}</p>
                        <p class="user-info-date">{{blog.createdAt}}</p>
                    </div>
                    <div class="blog-type">{{blog.blogType}}</div>
                </div>
                <div class="discover-item-body">
                    <div class="blog-img" v-if="blog.blogCover.indexOf('undefined')==-1">
                        <img :src="blog.blogCover">
                        <p class="blog-title">{{blog.blogTitle}}</p>
                    </div>
                    <div v-else class="blog-title">{{blog.blogTitle}}</div>
                    <p class="blog-des">{{blog.blogDes}}</p>
                </div>
                <div class="discover-item-foot"></div>
            </div>
        </div>
        <infinite-loading :on-infinite="getBlog" ref="infiniteLoading">
            <span slot="no-more">~没有更多啦~</span>
        </infinite-loading>
    </div>
</template>

<script>
    import InfiniteLoading from 'vue-infinite-loading';

    export default {
        name: 'DiscoverIndex',
        components: { InfiniteLoading },
        data: function () {
            return {
                blogList: [],
                page: 1,
                size: 5
            };
        },
        methods: {
            getBlog: function ($state) {
                let params = { page: (this.blogList.length / this.size) + 1, size: this.size},
                    _this = this;

                console.log(this.blogList.length);
                this.$ajax({
                    method: 'get',
                    url: '/blogList/list',
                    params: params
                }).then(function (res) {
                    if(res.data.code == 0){
                        _this.blogList = _this.blogList.concat(res.data.data.blogList);

                        if (res.data.data.blogList.length === _this.size) {
                            $state.loaded();
                        } else {
                            $state.complete();
                        }
                    } else {
                        console.log(res.data.message);
                    }
                }).catch(function () {
                    console.log('error');
                });
            }
        }
    };
</script>