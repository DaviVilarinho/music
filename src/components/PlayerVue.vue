<template>
  <!-- Player -->
  <div class="fixed bottom-0 left-0 bg-white p-5 pb-4 text-left align-top w-full h-16 pb-24">
    <div class="relative">
      <!-- Play/Pause Button -->
      <div class="float-left w-7 h-7 leading-3">
        <button
          type="button"
          @click.prevent="pausePlaying"
          v-if="this.$store.state.sound?.playing && this.$store.state.sound.playing()"
        >
          <i class="fa fa-pause text-gray-500 text-xl" />
        </button>
        <button
          type="button"
          @click.prevent="playCurrentSong"
          :disabled="this.$store.state.sound === undefined"
          v-else
        >
          <i class="fa fa-play text-gray-500 text-xl" />
        </button>
      </div>
      <!-- Current Position -->
      <div class="float-left w-7 h-7 leading-3 text-gray-400 mt-0 text-lg w-14 ml-5 mt-1">
        <span class="player-currenttime">{{ $store.state.seek }}</span>
      </div>
      <!-- Scrub -->
      <div
        class="float-left w-7 h-7 leading-3 ml-7 mt-2 player-scrub"
      >
        <div
          class="absolute left-0 right-0 text-lg text-center mx-auto player-song-info"
          v-if="$store.state.currentSong?.modified_name !== undefined"
        >
          <span class="song-title">{{ $store.state.currentSong?.modified_name ?? 'No music playing' }}</span>
          <span 
            class="song-artist"
            v-show="$store.state.currentSong?.display_name"
          > - (Uploaded by {{ $store.state.currentSong?.display_name }})</span>
        </div>
        <!-- Scrub Container  -->
        <span
          class="block w-full h-2 rounded m-1 mt-2 bg-gray-200 relative cursor-pointer"
          @click.prevent="updateSeek"
        >
          <!-- Player Ball -->
          <span
            class="absolute top-neg-8 text-gray-800 text-lg"
            :style="{ left: completionPercentage }"
          >
            <i class="fas fa-circle" />
          </span>
          <!-- Player Progress Bar-->
          <span
            class="block h-2 rounded bg-gradient-to-r from-green-500 to-green-400"
            :style="{ width: completionPercentage }"
          />
        </span>
      </div>
      <!-- Duration -->
      <div class="float-left w-7 h-7 leading-3 text-gray-400 mt-0 text-lg w-14 ml-8 mt-1">
        <span class="player-duration">{{ $store.state.duration }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex';
export default {
  name: 'PlayerVue',
  methods: {
    ...mapMutations(['playCurrentSong', 'pausePlaying']),
    ...mapActions(['updateSeek']),
  },
  computed: {
    completionPercentage() {
      return Math.floor(this.$store.state.completion * 100) + '%';
    }
  }
}
</script>