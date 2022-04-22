<script>
export default{
    name: 'Auth',
    props: ['code'],
    mounted(){
        localStorage.setItem('code', this.code)
        return window.location.href = '/dash'
    },
}
</script>



<template>
    <h1>auth: {{this.code}}</h1>
</template>



<style>

</style>