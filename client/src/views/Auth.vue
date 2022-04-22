<script>
export default{
    name: 'Auth',
    props: ['code'],
    mounted(){
        localStorage.setItem('code', this.code)
    }
}

</script>



<template>
    <h1>authorizing ...</h1>
</template>



<style>

</style>