<template>
  <section id="momentBlog" class="moment-page">
    <Header></Header>
    <div id="homeContent" class="home-content">
      <div class="blog-list">
        <div class="blog-info">
          <div class="blog-head">Azumar</div>
          <div class="blog-time">9月11日</div>
          <div class="blog-comment">15</div>
        </div>
        <div class="blog-content">cvbb</div>
      </div>
      <div class="home-extra">222</div>
    </div>

  </section>
</template>

<script>
import Header from './../components/home/header.vue'

export default {
  components: { Header }
}
</script>

<style>
  .moment-page {
    background: #f5f5f5;
  }
  .home-content {
    display: flex;
    width: 1200px;
    margin: 0 auto;
  }
  .blog-list{
    flex: 5;
    background: green;
    margin-right: 10px;
    display: flex;
  }
  .home-extra{
    flex: 2;
    background: #2d8cf0;
    margin-left: 10px;
  }







.container
{
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
.title
{
  font-family: "Quicksand", "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; /* 1 */
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}
.subtitle
{
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}
.links
{
  padding-top: 15px;
}
</style>
