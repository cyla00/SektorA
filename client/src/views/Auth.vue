<script>
export default{
    name: 'Auth',
    props: ['code'],
    mounted(){
        localStorage.setItem('code', this.code)
        this.$router.push({path: '/dash'})
    },
}
</script>



<template>
    <h1>auth: {{this.code}}</h1>
</template>



<style>

</style>