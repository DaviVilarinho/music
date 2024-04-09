<template>
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
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import UploadMusic from '@/components/UploadMusic.vue';
import { db, auth } from '@/includes/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import MusicMetadata from '@/components/MusicMetadata.vue';

export default {
  name: 'ManageView',
  components: { UploadMusic, MusicMetadata },
  data() {
    return {
      songs: [],
    }
  },
  async created() {
    const snapshots = await getDocs(
      query(collection(db, "songs"), where('uid', '==', auth.currentUser.uid)));

    snapshots.forEach(snapshot => {
      this.songs.push({
        ...snapshot.data(),
        docID: snapshot.id
      });
    });

  }
};
</script>