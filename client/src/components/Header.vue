<script>
    export default{
        name: 'Header',
        props: ['code'],
        data(){
            return{
                code_check: false,
            }
        },
        mounted(){
            if(localStorage.getItem('code')){
                return this.code_check = true
            }
        },
        methods: {
            logout: () => {
                localStorage.removeItem('code')
                this.$router.push({path: '/'})
            },
        }
    }
</script>



<template>

    <RouterLink to="/">Home</RouterLink>
    <a v-if="this.code_check" href="https://discord.com/api/oauth2/authorize?client_id=962299605041709076&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth&response_type=code&scope=identify%20email%20guilds">Login</a>
    <button v-if="this.code_check" v-on:click="logout()">Logout</button>
    <RouterLink v-if="this.code_check" to="/dash">Dashboard</RouterLink>

    <RouterView />

</template>



<style scoped>

</style>