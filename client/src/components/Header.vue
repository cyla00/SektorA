<script>
    export default{
        name: 'Header',
        props: ['code'],
        data(){
            return{
                code_check: '',
                id_check: '',
            }
        },
        mounted(){
            if(localStorage.getItem('code') !== null){
                this.code_check = true
            }
            else{
                this.code_check = false
            }

            if(localStorage.getItem('id') !== null){
                this.id_check = true
            }
            else{
                this.id_check = false
            }
        },
        methods: {
            logout: () => {
                if(confirm('are you sure you want to logout?')){
                    // localStorage.removeItem('code')
                    localStorage.clear()
                    return window.location.href = '/'
                }
                else{
                    return
                }
            },
        }
    }
</script>



<template>

    <RouterLink to="/">Home</RouterLink>
    <a v-if="!this.id_check" href="https://discord.com/api/oauth2/authorize?client_id=962299605041709076&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth&response_type=code&scope=identify%20email%20guilds">Login with discord</a>
    <button v-if="this.id_check == true" v-on:click="logout()">Logout</button>
    <RouterLink v-if="this.id_check == true" to="/dash">Dashboard</RouterLink>

    <RouterView />

</template>



<style scoped>

</style>