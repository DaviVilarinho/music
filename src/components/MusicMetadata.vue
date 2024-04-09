<template>
  <div class="border border-gray-200 p-3 mb-4 rounded">
    <div v-show="!showForm">
      <h4 class="inline-block text-2xl font-bold">
        {{ song.modified_name }}
      </h4>
      <button class="ml-1 py-1 px-2 text-sm rounded text-white bg-red-600 float-right">
        <i class="fa fa-times" />
      </button>
      <button 
        class="ml-1 py-1 px-2 text-sm rounded text-white bg-blue-600 float-right"
        @click.prevent="showForm = !showForm"
      >
        <i class="fa fa-pencil-alt" />
      </button>
    </div>
    <div v-show="showForm">
      <div
        class="text-white text-center font-bold p-4 mb-4"
        :class="alertVariant"
        v-if="showAlert"
      >
        {{ alertMessage }}
      </div>
      <vee-form 
        :validation-schema="schema"
        @submit="updateSong"
        :initial-values="song"
      >
        <div class="mb-3">
          <label class="inline-block mb-2">Song Title</label>
          <vee-field
            type="text"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300
                        transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Enter Song Title"
            name="modified_name"
          />
          <vee-error-message
            class="text-red-600"
            name="modified_name"
          />
        </div>
        <div class="mb-3">
          <label class="inline-block mb-2">Genre</label>
          <vee-field
            type="text"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300
                        transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Enter Genre"
            name="genre"
          />
          <vee-error-message
            class="text-red-600"
            name="genre"
          />
        </div>
        <button
          type="submit"
          class="py-1.5 px-3 rounded text-white bg-green-600"
          :disabled="in_submission"
        >
          Submit
        </button>
        <button
          type="button"
          class="py-1.5 px-3 rounded text-white bg-gray-600"
          @click.prevent="showForm = !showForm"
          :disabled="in_submission"
        >
          Go Back
        </button>
      </vee-form>
    </div>
  </div>
</template>

<script>
import { db } from '@/includes/firebase';
import { setDoc, doc } from 'firebase/firestore';
import { mapMutations } from 'vuex';

const SENDING_MESSAGE = 'Editing...';
const SENDING_VARIANT = 'bg-blue-400';

const SENT_MESSAGE = 'Succesfully Edited!';
const SENT_VARIANT = 'bg-green-400';

const NOT_SENT_MESSAGE = 'Could not edit.';
const NOT_SENT_VARIANT = 'bg-red-400';

export default {
  name: 'MusicMetadata',
  methods: {
    async updateSong(songFormData) {
      this.in_submission = true;

      this.showAlert = true;
      this.alertMessage = SENDING_MESSAGE;
      this.alertVariant = SENDING_VARIANT;

      try {
        await setDoc(doc(db, 'songs', this.song.docID), songFormData, {merge: true});
        this.alertMessage = SENT_MESSAGE;
        this.alertVariant = SENT_VARIANT;
        
        this.$store.commit('changeSong', { 
          i: this.song.docID, 
          modified_name: songFormData.modified_name,
          genre: songFormData.genre,
        });
      } catch (error) {
        this.alertMessage = NOT_SENT_MESSAGE;
        this.alertVariant = NOT_SENT_VARIANT;
      }

      this.in_submission = false
    }
  },
  data() {
    return {
      showForm: false,
      schema: {
        modified_name: 'required|min:1|max:100',
        genre: 'min:5|max:100|alpha_spaces',
      },
      in_submission: false,
      showAlert: false,
      alertMessage: '',
      alertVariant: '',
    };
  },
  props: {
    song: {
      type: Object,
      required: true
    }
  }
}
</script>