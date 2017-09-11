<template>
  <section id="moment" class="moment-page">
    <Header></Header>
    <div class="moment-blog">
      <div class="blog-left">
        <nuxt-child></nuxt-child>
      </div>
      <div class="blog-right">
        <BlogInfo></BlogInfo>
        <BlogAbout></BlogAbout>
      </div>
    </div>

  </section>
</template>

<script>
import Header from './../components/home/header.vue'
import BlogInfo from './../components/home/blogInfo.vue'
import BlogAbout from './../components/home/blogAbout.vue'

export default {
  components: { Header, BlogInfo, BlogAbout }
}
</script>
