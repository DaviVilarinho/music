<template>
  <main>
    <!-- Main Content -->
    <section class="container mx-auto mt-6">
      <div class="md:grid md:grid-cols-3 md:gap-4">
        <div class="col-span-1">
          <upload-music />
        </div>
        <div class="col-span-2">
          <div class="bg-white rounded border border-gray-200 relative flex flex-col">
            <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
              <span class="card-title">My Songs</span>
              <i class="fa fa-compact-disc float-right text-green-400 text-2xl" />
            </div>
            <div class="p-6">
              <!-- Composition Items -->
              <music-metadata
                v-for="song in songs"
                :key="song.docID"
                :song="song"
                :update-unsaved-flag="updateUnsavedFlag"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import UploadMusic from '@/components/UploadMusic.vue';
import MusicMetadata from '@/components/MusicMetadata.vue';
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'ManageView',
  components: { UploadMusic, MusicMetadata },
  computed: {
    ...mapGetters(['songs']),
  },
  data() {
    return {
      unsavedFlag: false,
    };
  },
  methods: {
    ...mapActions(['querySongsByUser']),
    updateUnsavedFlag(value) {
      this.unsavedFlag = value;
    }
  },
  async created() {
    await this.querySongsByUser();
  },
  beforeRouteLeave(to, from, next) {
    if (this.unsavedFlag) {
      const leave = confirm('You have not submitted your changes. Are you sure you want to leave?');
      if (!leave) {
        return;
      }
    }
    next();
  }
};
</script>