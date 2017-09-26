<template>
  <header id="header" class="home-header">
    <nav>
      <div class="header-img"><img :src="imgUrl"></div>
    </nav>
  </header>
</template>

<script>
  export default {
    name: 'header',
    data: function () {
      return {
        imgUrl: ''
      }
    },
    mounted: function () {
      this.imgUrl = 'http://' + window.location.hostname + ':10366/dist/img/logo-colorful.png'
    }
  }
</script>
