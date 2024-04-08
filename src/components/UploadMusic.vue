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
      <hr class="my-6">
      <div
        class="mb-4"
        v-for="(uploadObject, filename) in uploads"
        :key="filename"
      >
        <!-- File Name -->
        <div class="font-bold text-sm">
          {{ filename }}
        </div>
        <div class="flex h-4 overflow-hidden bg-gray-200 rounded">
          <!-- Inner Progress Bar -->
          <div
            class="transition-all progress-bar bg-blue-400"
            :style="{ width: uploadObject.currentProgress + '%' }"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { storage } from '@/includes/firebase';
import { ref, uploadBytesResumable } from 'firebase/storage';

export default {
  name: 'UploadMusic',
  data() {
    return {
      isDragOver: false,
      uploads: {}
    };
  },
  methods: {
    upload($event) {
      const files = [...$event.dataTransfer.files];

      files.forEach((file) => {
        if (file.type !== 'audio/mpeg') {
          return;
        }
        const storageRef = ref(storage, `songs/${file.name}`);

        const task = uploadBytesResumable(storageRef, file);

        this.uploads[file.name] = {
          task,
          currentProgress: 0,
          name: file.name
        };

        task.on('state_changed', (snapshot) => {
          this.uploads[file.name].currentProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        },
          (error) => { console.log(error) },
          () => {
            this.isDragOver = false;
          }
        );
      });

      this.isDragOver = false;
    }
  }
}
</script>