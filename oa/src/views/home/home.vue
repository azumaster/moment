<template>
    <section id="home">
        <Row class="home-row">
            <i-col span="8">
                <UserCard></UserCard>
            </i-col>
            <i-col span="15" push="1">12</i-col>
        </Row>
    </section>
</template>

<script>
    import UserCard from './../../components/home/userCard.vue';

    export default {
        name: 'home',
        components: { UserCard }
    };
</script>