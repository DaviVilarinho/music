<template>
  <main>
    <!-- Introduction -->
    <section class="mb-8 py-20 text-white text-center relative">
      <div
        class="absolute inset-0 w-full h-full bg-contain introduction-bg"
        style="background-image: url(assets/img/header.png)"
      />
      <div class="container mx-auto">
        <div class="text-white main-header-content">
          <h1 class="font-bold text-5xl mb-5">
            {{ $t('listen') }}
          </h1>
          <p class="w-full md:w-8/12 mx-auto">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus
            et dolor mollis, congue augue non, venenatis elit. Nunc justo eros,
            suscipit ac aliquet imperdiet, venenatis et sapien. Duis sed magna
            pulvinar, fringilla lorem eget, ullamcorper urna.
          </p>
        </div>
      </div>

      <img
        class="relative block mx-auto mt-5 -mb-20 w-auto max-w-full"
        src="assets/img/introduction-music.png"
      >
    </section>

    <!-- Main Content -->
    <section class="container mx-auto">
      <div class="bg-white rounded border border-gray-200 relative flex flex-col m-8 mb-32 pb-4">
        <div
          class="px-6 pt-6 pb-5 font-bold border-b border-gray-200"
          v-icon.right="'headphones-alt'"
        >
          <span class="card-title">Songs</span>
          <!-- Icon -->
        </div>
        <!-- Playlist -->
        <ol id="playlist">
          <song-item
            v-for="song in peopleSongs"
            :key="song.docID"
            :song="song"
          />
        </ol>
      <!-- .. end Playlist -->
      </div>
    </section>
  </main>
</template>

<script>
import SongItem from '@/components/SongItem.vue';
import { db } from '@/includes/firebase';
import { collection, doc, getDoc, getDocs, limit, orderBy, query, startAfter } from 'firebase/firestore';

export default {
  name: 'HomeView',
  components: {
    SongItem
  },
  data() {
    return {
      peopleSongs: {},
      peopleSongsOrder: [],
      maxPerPage: 3,
      hasPendingRequest: false
    }
  },
  methods: {
    async getPeopleSongs() {
      this.hasPendingRequest = true;
      const queryConstraints = [
        collection(db, "songs"), 
        limit(this.maxPerPage),
        orderBy('modified_name')
      ];
      if (this.peopleSongsOrder.length > 0) {
        queryConstraints.push(startAfter(await getDoc(doc(
          db, 
          `songs/${this.peopleSongsOrder.at(-1)}`))));
      }
      const snapshots = await getDocs(query(...queryConstraints));
      snapshots.forEach(snapshot => {
        this.peopleSongs[snapshot.id] = {...snapshot.data(), docID: snapshot.id};
        this.peopleSongsOrder.push(snapshot.id);
      });
      this.hasPendingRequest = false;
    },
    handleScroll() {
      const { scrollTop, offsetHeight } = document.documentElement;
      const { innerHeight } = window;

      const bottomWindow = (Math.round(scrollTop) + innerHeight) >= offsetHeight * 0.95 * (
        window.devicePixelRatio > 1 ? 0.95 : window.devicePixelRatio);

      if (bottomWindow && !this.hasPendingRequest){
        this.getPeopleSongs();
      }
    }
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  async created() {
    this.getPeopleSongs();

    window.addEventListener('scroll', this.handleScroll);
  }
}
</script>
