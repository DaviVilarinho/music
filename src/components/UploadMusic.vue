<template>
  <div class="bg-white rounded border border-gray-200 relative flex flex-col">
    <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-199">
      <span class="card-title">Upload</span>
      <i class="fas fa-upload float-right text-green-400 text-2xl" />
    </div>
    <div class="p-6">
      <!-- Upload Dropbox -->
      <div
        class="w-full px-10 py-20 rounded text-center cursor-pointer border border-dashed
                border-gray-400 text-gray-400 transition duration-500 hover:text-white
                hover:bg-green-400 hover:border-green-400 hover:border-solid"
        :class="{ 'bg-green-400 border-green-400 border-solid': isDragOver }"
        @drag.prevent.stop=""
        @dragstart.prevent.stop=""
        @dragover.prevent.stop="isDragOver = true"
        @dragenter.prevent.stop="isDragOver = true"
        @dragend.prevent.stop="isDragOver = false"
        @dragleave.prevent.stop="isDragOver = false"
        @drop.prevent.stop="upload($event)"
      >
        <h5>Drop your files here</h5>
      </div>
      <div>
        <input 
          class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
          aria-describedby="file_input_help"
          id="file_input"
          type="file"
          multiple
          @change="upload($event)"
        >
        <p 
          class="mt-1 text-sm text-gray-500 dark:text-gray-300"
          id="file_input_help"
        >
          MP3 (Max 10Mb).
        </p>
      </div>
      <hr class="my-6">
      <div
        class="mb-4"
        v-for="(uploadObject, filename) in uploads"
        :key="filename"
      >
        <!-- File Name -->
        <div 
          class="font-bold text-sm" 
          :class="uploadObject.text_class"
        >
          <i :class="uploadObject.icon" /> {{ filename }}
        </div>
        <div class="flex h-4 overflow-hidden bg-gray-200 rounded">
          <!-- Inner Progress Bar -->
          <div
            class="transition-all progress-bar bg-blue-400"
            :class="uploadObject.variant"
            :style="{ width: uploadObject.currentProgress + '%' }"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { storage, auth, db } from '@/includes/firebase';
import { addDoc, collection } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { mapMutations, mapGetters } from 'vuex';

export default {
  name: 'UploadMusic',
  data() {
    return {
      isDragOver: false,
      uploads: {}
    };
  },
  computed: {
    ...mapGetters(['songs']),
  },
  methods: {
    ...mapMutations(['addSong']),
    upload($event) {
      const files = [...($event.dataTransfer?.files ?? $event.target?.files)];

      files.forEach((file) => {
        if (file.type !== 'audio/mpeg') {
          return;
        }

        if (!navigator.onLine) {
          this.uploads[file.name] = {
            name: file.name,
          };
          this.uploads[file.name].text_class = 'text-red-400';
          this.uploads[file.name].variant = 'bg-red-400';
          this.uploads[file.name].icon = 'fas fa-times';
          return;
        }
        const storageRef = ref(storage, `songs/${file.name}`);

        const task = uploadBytesResumable(storageRef, file);

        this.uploads[file.name] = {
          task,
          currentProgress: 0,
          name: file.name,
          variant: 'bg-blue-400',
          icon: 'fas fa-spinner fa-spin',
          text_class: ''
        };

        task.on('state_changed', 
          (snapshot) => {
            this.uploads[file.name].currentProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          },
          (error) => { 
            this.isDragOver = false;
            this.uploads[file.name].text_class = 'text-red-400';
            this.uploads[file.name].variant = 'bg-red-400';
            this.uploads[file.name].icon = 'fas fa-times';
          },
          async () => {
            const song = {
              uid: auth.currentUser.uid,
              display_name: auth.currentUser.displayName,
              original_name: task.snapshot.ref.name,
              modified_name: task.snapshot.ref.name,
              genre: '',
              comment_count: 0
            };

            song.url = await getDownloadURL(task.snapshot.ref);

            const docSnapshot = await addDoc(collection(db, "songs"), song);

            this.isDragOver = false;
            this.uploads[file.name].text_class = 'text-green-400';
            this.uploads[file.name].variant = 'bg-green-400';
            this.uploads[file.name].icon = 'fas fa-check';

            song.docID = docSnapshot.id;
            
            this.addSong({ docID: docSnapshot.id, song: song } );
          }
        );
      });

      this.isDragOver = false;
    }
  },
  beforeUnmount() {
    Object.values(this.uploads).forEach(upload => upload.task.cancel());
  }
}
</script>