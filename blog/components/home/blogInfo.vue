<template>
  <div class="blog-info">
    <div class="info-"></div>
    <div class="info-item">
      <h3 class="info-title">文章分类</h3>
      <div class="info-list">
        <div v-for="type in this.typeList" class="info-list-item can-click">{{type.name}} <i class="icon right"></i></div>
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
