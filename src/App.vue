<template>
  <music-header />

  <router-view />

  <player-vue />
  <!-- Auth Modal -->
  <music-auth />
</template>

<script>
import MusicAuth from './components/MusicAuth.vue';
import MusicHeader from './components/MusicHeader.vue';
import PlayerVue from './components/PlayerVue.vue';

export default {
  name: 'App',
  components: {
    MusicHeader,
    MusicAuth,
    PlayerVue
  },
  created() {
    this.$store.dispatch('init_login');
  }
}
</script>

