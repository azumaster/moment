<template>
  <div class="blog-list">
    <div v-for="blog in this.blogList" class="blog-item">
      <div class="blog-author">
        <div class="author">
          <div class="author-head"><img :src="blog.author.head"></div>
          <p>{{blog.author.name}}</p>
        </div>
        <div class="blog-extra">
          <div class="extra-item"><p class="icon clock"></p><p>{{blog.dateTime}}</p></div>
          <!--<div class="extra-item"><p class="icon comment"></p><p>18</p></div>-->
          <div class="extra-item"><p class="icon category"></p><p>{{blog.blogType}}</p></div>
        </div>
      </div>
      <div class="bloging">
        <div class="blog-img"><img src="http://pic1.16xx8.com/allimg/161018/1301222C9-0.jpg"></div>
        <div class="blog-content">
          <h1><a href="">{{blog.blogTitle}}</a></h1>
          <p>{{blog.blogDes}}</p>
          <div class="detail-btn">查看全文 <i class="icon right-circle"></i></div>
        </div>
      </div>
    </div>
    <div class="blog-loading">点击加载更多</div>
  </div>
</template>

<script>
  import axios from 'axios'

  export default {
    name: 'blogList',
    data: function () {
      return {
        params: {
          page: 1,
          size: 20
        },
        blogList: [],
        total: 0
      }
    },
    methods: {
      getBlogList: function () {
        let _this = this

        axios.get('http://' + window.location.hostname + ':10366/blog/list', {params: this.params})
          .then(function (res) {
            if (res.data.code === 0) {
              res.data.data.blogList.map((blog) => {
                blog.author.head = 'http://' + window.location.hostname + ':10366' + blog.author.head
                blog.dateTime = blog.createdAt.split(' ')[0]
              })

              _this.blogList = res.data.data.blogList
              _this.total = res.data.data.total
            } else {

            }
          })
          .catch(function (err) {
            console.log(err)
          })
      }
    },
    mounted: function () {
      this.getBlogList()
    }
  }
</script>
