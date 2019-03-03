<template>
    <div :class="disabled ? 'disabled' : ''"
         @click="openFileSelector"
         class="app-file-uploader">
        <md-avatar class="md-large">
            <md-icon v-if="disabled">cloud_off</md-icon>
            <md-icon v-else-if="value === null">cloud_upload</md-icon>
            <img :src="value"
                 alt=""
                 v-else/>
        </md-avatar>
        <md-progress-bar :md-value="progress"
                         class="md-accent"
                         md-mode="determinate"
                         v-if="progress > 0 && progress < 100">
        </md-progress-bar>
        <p v-else-if="!disabled">{{ $t('APP_FILE_UPLOADER.LABEL') }}</p>
        <input :accept="accept"
               @change="upload"
               ref="fileSelector"
               type="file"/>
    </div>
</template>

<script>
import firebase from 'firebase/app';

export default {
  name: 'AppFileUploader',
  props: {
    value: {
      type: String,
      default: null,
    },
    pathOnCloudStorage: {
      type: String,
      default: null,
    },
    accept: {
      type: String,
      default: 'image/*',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      progress: 0,
    };
  },
  methods: {
    openFileSelector() {
      if (!this.disabled) {
        this.$refs.fileSelector.click();
      }
    },
    upload() {
      const file = this.$refs.fileSelector.files[0];
      const fileName = file.name.toLowerCase().replace(' ', '-');

      const metadata = {};
      metadata.createdBy = firebase.auth().currentUser.uid;

      const uploadTask = firebase.storage().ref()
      .child(`${this.pathOnCloudStorage}/${fileName}`)
      .put(file, metadata);

      uploadTask.on('state_changed',
      snapshot => this.progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
      error => console.error(error),
      () => {
        uploadTask.snapshot.ref
        .getDownloadURL()
        .then(url => this.$emit('input', url));
      });
    },
  },
};
</script>

<style scoped lang="scss">
.app-file-uploader {
    padding: 2rem;
    margin: 1rem 0;
    text-align: center;
    border-radius: 4px;
    border: 3px dotted rgba(0, 0, 0, 0.54);

    &:hover {
        cursor: pointer;
    }

    &.disabled {
        color: lightgrey;
        border-color: lightgrey;

        &:hover {
            cursor: not-allowed;
        }

        .md-icon {
            color: lightgrey;
        }
    }

    p {
        font-weight: bold;
    }

    input[type="file"] {
        display: none;
    }
}
</style>
