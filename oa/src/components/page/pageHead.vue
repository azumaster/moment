<template>
    <div id="pageHead" style="margin-bottom: 20px;">
        <h1 style="padding: 10px 0;">{{title}}</h1>
        <hr>
    </div>
</template>

<script>
    export default {
        name: 'pageHead',
        props: ['title']
    };
</script>