<script>

export default{
    name: 'Profile',
    data(){
        return{
            id: localStorage.getItem('id'),
            username: `${localStorage.getItem('username')}#${localStorage.getItem('discriminator')}`,
            email: localStorage.getItem('email'),
            avatar: `https://cdn.discordapp.com/avatars/${localStorage.getItem('id').toString()}/${localStorage.getItem('avatar').toString()}.png`,
            country: localStorage.getItem('country').toUpperCase()
        }
    },
    mounted(){
        
    }
}

</script>



<template>
    <h1>profile</h1>
    <div>
        <img id="avatar" src="https://cdn.discordapp.com/avatars/853180555947409419/9bb6a19b5d0e4b615e8df1662900faef.png" alt="">
        <h3>{{this.username}}</h3>
        <h3>{{this.country}}</h3>
        <p>{{this.avatar}}</p>
    </div>

</template>



<style scoped>
</style>