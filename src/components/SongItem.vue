<template>
  <li 
    class="flex justify-between items-center p-3 pl-6 cursor-pointer transition duration-300 hover:bg-gray-50"
    @click.prevent="$store.state.currentSong?.original_name !== song.original_name 
      ? newSong(song)
      : () => {}"
    :class="{ 'bg-green-50' : $store.state.currentSong?.original_name === song.original_name }"
  >
    <div>
      <router-link
        :to="{ name: 'song', params: { id: song.docID } }"
        class="font-bold block text-gray-600"
      >
        {{ song.modified_name }}
      </router-link>
      <span class="text-gray-500 text-sm">{{ song.display_name }}</span>
    </div>
    <div class="text-gray-600 text-lg">
      <router-link
        custom
        :to="{ name: 'song', params: { id: song.docID }, hash: '#comments' }"
        v-slot="{ navigate }"
      >
        <span
          class="comments"
          @click="navigate"
        >
          <i class="fa fa-comments text-gray-600" />
          {{ song.comment_count ?? 0 }}
        </span>
      </router-link>
    </div>
  </li>
</template>

<script>
import {mapActions} from 'vuex';
export default {
  name: 'SongItem',
  methods: {
    ...mapActions(['newSong'])
  },
  props: {
    song: {
      type: Object,
      required: true,
    }
  }
}
</script>