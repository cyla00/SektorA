<script>
import axios from 'axios'

export default{
    name: 'Auth',
    props: ['code'],
    mounted(){

        localStorage.setItem('code', this.code)

        var config = {
            headers: {
                Authorization: localStorage.getItem('code')
            }
        }

        async function code_auth(){
            try{
                await axios.post('http://localhost:5000/api/auth', {}, config,).then(res => {
                    if(res.status !== 200) {
                        window.location.href = '/error'
                    }
                    else{
                        localStorage.removeItem('code')
                        localStorage.setItem('access_token', res.data.access_token)
                        localStorage.setItem('id', res.data.id)
                        localStorage.setItem('username', res.data.username)
                        localStorage.setItem('discriminator', res.data.discriminator)
                        localStorage.setItem('email', res.data.email)
                        localStorage.setItem('avatar', res.data.avatar)
                        localStorage.setItem('country', res.data.country)
                        window.location.href = '/dash'
                    }
                    
                })
            }
            catch(err){
                console.error(err)
            }
        }
        code_auth()
    },
}
</script>



<template>
    <h1>authenticating...</h1>
</template>



<style>

</style>