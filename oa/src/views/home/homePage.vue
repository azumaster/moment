<template>
    <section id="homePage">
        <Row class="home-row">
            <i-col span="8"><UserCard></UserCard></i-col>
            <i-col span="8" push="1"><WeatherCard></WeatherCard></i-col>
            <i-col span="6" push="2">6</i-col>
        </Row>
    </section>
</template>

<script>
    import UserCard from './../../components/home/userCard.vue';
    import WeatherCard from './../../components/home/weather.vue';

    export default {
        name: 'home',
        components: { UserCard, WeatherCard }
    };
</script>