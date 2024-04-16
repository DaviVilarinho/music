<template>
  <music-header />

  <router-view v-slot="{ Component }">
    <transition name="fade">
      <component :is="Component" />
    </transition>
  </router-view>

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

<style scoped>
.fade-enter-from {
  opacity: 0;
}

.fade-enter-active {
  transition: all 0.5s linear;
}

.fade-leave-to {
  transition: all 0.5s linear;
  opacity: 0;
}
</style>
