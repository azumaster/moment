<template>
  <div class="blog-info">
    <div class="info-"></div>
    <div class="info-item">
      <h3 class="info-title">文章分类</h3>
      <div class="info-list">
        <div class="info-list-item">分类1 <i class="icon right"></i></div>
        <div class="info-list-item">分类2分类2 <i class="icon right"></i></div>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'

  export default {
    name: 'blogInfo',
    data: function () {
      return {
        typeList: []
      }
    },
    methods: {
      getTypeList: function () {
        let _this = this
        axios.get('http://' + window.location.hostname + ':10366/blog/type/list')
          .then(function (res) {
            if (res.data.code === 0) {
              _this.typeList = res.data.data
              console.log(_this.typeList)
            } else {

            }
          })
          .catch(function (err) {
            console.log(err)
          })
      }
    },
    mounted: function () {
      this.getTypeList()
    }
  }
</script>
