<template>
  <!-- Music Header -->
  <section class="w-full mb-8 py-14 text-center text-white relative px-4">
    <div
      class="absolute inset-0 w-full h-full box-border bg-contain music-bg"
      style="background-image: url(/assets/img/song-header.png)"
    />
    <div class="container mx-auto flex items-center">
      <!-- Play/Pause Button -->
      <button
        type="button"
        class="z-50 h-24 w-24 text-3xl bg-white text-black rounded-full
        focus:outline-none"
        @click.prevent="pausePlaying"
        v-if="songData.uid === this.$store.state.currentSong?.uid && 
          this.$store.state.sound?.playing && this.$store.state.sound.playing()"
      >
        <i class="fas fa-pause" />
      </button>
      <button
        type="button"
        class="z-50 h-24 w-24 text-3xl bg-white text-black rounded-full
        focus:outline-none"
        @click.prevent="songData.uid !== this.$store.state.currentSong?.uid 
          ? newSong(songData) 
          : playCurrentSong(songData)"
        v-else
      >
        <i class="fas fa-play" />
      </button>
      <div class="z-50 text-left ml-8">
        <!-- Song Info -->
        <div class="text-3xl font-bold">
          {{ songData?.modified_name }}
        </div>
        <div>{{ songData?.genre }}</div>
      </div>
    </div>
  </section>
  <!-- Form -->
  <section
    class="container mx-auto mt-6"
  >
    <div class="bg-white rounded border border-gray-200 relative flex flex-col">
      <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
        <!-- Comment Count -->
        <span class="card-title">Comments ({{ comments?.length ?? 0 }})</span>
        <i class="fa fa-comments float-right text-green-400 text-2xl" />
      </div>
      <div
        class="p-6"
      >
        <div
          v-if="this.$store.state.userLoggedIn"
        >
          <div
            v-if="commentShowAlert"
            class="text-white text-center font-bold p-5 mb-4"
            :class="commentAlertVariant"
          >
            {{ commentAlertText }}
          </div>
          <vee-form 
            :schema="schema"
            @submit="addComment"
          >
            <vee-field
              as="textarea"
              name="comment"
              class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
              duration-500 focus:outline-none focus:border-black rounded mb-4"
              placeholder="Your comment here..."
            />
            <VeeErrorMessage
              class="text-red-600"
              name="comment"
            />
            <button
              type="submit"
              class="py-1.5 px-3 rounded text-white bg-green-600 block"
              :disabled="commentInSubmission"
            >
              Submit
            </button>
          </vee-form>
        </div>
        <!-- Sort Comments -->
        <select
          v-model="selectedSort"
          class="block mt-4 py-1.5 px-3 text-gray-800 border border-gray-300 transition
          duration-500 focus:outline-none focus:border-black rounded"
        >
          <option value="1">
            Latest
          </option>
          <option value="2">
            Oldest
          </option>
        </select>
      </div>
    </div>
  </section>
  <!-- Comments -->
  <ul class="container mx-auto mb-32">
    <li 
      class="p-6 bg-gray-50 border border-gray-200" 
      v-for="userComment in getSortedComments"
      :key="userComment.commentId" 
    >
      <!-- Comment Author -->
      <div
        class="mb-5"
      >
        <div class="font-bold">
          {{ userComment.name }}
        </div>
        <time class="text-slate-300">at {{ (new Date(userComment.datePosted)).toLocaleString() }}</time>
      </div>

      <p>
        {{ userComment.content }}
      </p>
    </li>
  </ul>
</template>

<script>
import { mapActions, mapMutations } from 'vuex';
import { db, auth } from '@/includes/firebase';
import { addDoc, collection, doc, getDoc, getDocs, orderBy, query, setDoc } from 'firebase/firestore';

const COMMENT_SUBMITTING_VARIANT = 'bg-blue-400';
const COMMENT_SUBMITTING_TEXT = 'Commenting...'

const COMMENT_SUBMITTED_VARIANT = 'bg-green-400';
const COMMENT_SUBMITTED_TEXT = 'Succesfully added comment.'

const COMMENT_NOT_SUBMITTED_VARIANT = 'bg-red-400';
const COMMENT_NOT_SUBMITTED_TEXT = 'Could not add comment, try again later.'

export default {
  name: 'SongView',
  data() {
    return {
      selectedSort: '1',
      songData: {},
      comments: [],
      schema: {
        comment: 'required|min:3|max:250'
      },
      commentInSubmission: false,
      commentShowAlert: false,
      commentAlertVariant: COMMENT_SUBMITTING_VARIANT,
      commentAlertText: COMMENT_SUBMITTING_TEXT,
    }
  },
  computed: {
    getSortedComments() {
      const sortedCollection = this.comments.toSorted((a, b) => {
          let keyA = new Date(a.datePosted);
          let keyB = new Date(b.datePosted);
          if (keyA < keyB) return -1;
          if (keyA > keyB) return 1;
          return 0;
      });

      if (this.selectedSort == '1') {
        sortedCollection.reverse();
      }

      return sortedCollection;
    }
  },
  methods: {
    ...mapActions(['newSong']),
    ...mapMutations(['pausePlaying', 'playCurrentSong']),
    async addComment(formValue) {
      this.commentInSubmission = true;
      this.commentShowAlert = true;
      this.commentAlertVariant = COMMENT_SUBMITTING_VARIANT;
      this.commentAlertText = COMMENT_SUBMITTING_TEXT;

      const comment = {
        content: formValue.comment,
        datePosted: new Date().toString(),
        songId: this.$route.params.id,
        name: auth.currentUser?.displayName ?? '[private]',
        uid: auth.currentUser?.uid
      }

      try {
        await addDoc(collection(db, `comments/${this.$route.params.id}/songComments`), comment);
        this.comments.push(comment);

        this.commentAlertVariant = COMMENT_SUBMITTED_VARIANT;
        this.commentAlertText = COMMENT_SUBMITTED_TEXT;

        await setDoc(doc(db, `songs/${this.$route.params.id}`), {comment_count: this.comments.length} , {merge: true})
      } catch (error) {
        this.commentAlertVariant = COMMENT_NOT_SUBMITTED_VARIANT;
        this.commentAlertText = COMMENT_NOT_SUBMITTED_TEXT;
      }

      
      this.commentInSubmission = false;
    },
    async getSongData() {
      const snapshot = await getDoc(doc(db, `songs/${this.$route.params.id}`));

      if (!snapshot.exists()) {
        this.$router.push({ name: 'home' });
      }

      this.songData = snapshot.data();
    },
    async getCommentData() { 
      const snapshots = await getDocs(
        collection(db, `comments/${this.$route.params.id}/songComments`), 
        query(orderBy('datePosted')));

      const newComments = [];
      snapshots.forEach(snapshot => newComments.push({... snapshot.data(), commentId: snapshot.id}));

      this.comments = newComments;
    }
  },
  async created() {
    await this.getSongData();
    await this.getCommentData();
  },
}
</script>