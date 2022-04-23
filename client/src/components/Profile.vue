<script>

export default{
    name: 'Profile',
    data(){
        return{
            id: localStorage.getItem('id'),
            username: `${localStorage.getItem('username')}#${localStorage.getItem('discriminator')}`,
            email: localStorage.getItem('email'),
            avatar: `https://cdn.discordapp.com/avatars/${localStorage.getItem('id')}/${localStorage.getItem('avatar')}.png`,
            country: localStorage.getItem('country').toUpperCase()
        }
    },
    mounted(){
        console.log(this.avatar);
    }
}

</script>



<template>
    <h1>profile</h1>
    <div>
        <img id="avatar" :src="this.avatar">
        <h3>{{this.username}}</h3>
        <h3>{{this.country}}</h3>
    </div>

</template>



<style scoped>

</style>