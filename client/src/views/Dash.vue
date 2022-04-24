<script>
import Profile from '../components/Profile.vue'
import Matches from '../components/Matches.vue'

export default{
    name: 'Dash',
    components: {
        Profile: Profile,
        Matches: Matches,
    },
}
</script>



<template>

    <Profile/>
    <Matches/>

</template>



<style scoped>

</style>