<script>
    import { RouterLink, RouterView } from 'vue-router'

</script>



<template>

    <RouterLink to="/">Home</RouterLink>
    <a href="https://discord.com/api/oauth2/authorize?client_id=962299605041709076&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth&response_type=code&scope=identify%20email%20guilds">Login</a>

    <RouterView />

</template>



<style scoped>

</style>