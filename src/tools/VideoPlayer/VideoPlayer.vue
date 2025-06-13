<!--
# Copyright 2022 Ball Aerospace & Technologies Corp.
# All Rights Reserved.
#
# This program is free software; you can modify and/or redistribute it
# under the terms of the GNU Affero General Public License
# as published by the Free Software Foundation; version 3 with
# attribution addendums as found in the LICENSE.txt
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU Affero General Public License for more details.
#
# This program may also be used under the terms of a commercial or
# enterprise edition license of COSMOS if purchased from the
# copyright holder

# Modified by OpenC3, Inc.
# All changes Copyright 2025, OpenC3, Inc.
# All Rights Reserved
#
# This file may also be used under the terms of a commercial license
# if purchased from OpenC3, Inc.
-->

<template>
  <top-bar v-if="!widgetConfig" :menus="menus" :title="title" />
  <video
    v-if="source.type === 'static'"
    :key="source.url"
    width="100%"
    :style="videoStyle"
    controls
    autoplay
    loop
  >
    <source :src="source.url" cross-origin="anonymous" type="video/mp4" />
  </video>
  <video v-else ref="video" width="100%" :style="videoStyle" controls />
  <v-dialog v-model="uploadDialog" max-width="600">
    <v-card class="pa-3">
      <v-card-title> Upload a video to be played back in COSMOS </v-card-title>
      <v-card-text>
        <v-row no-gutters align="center">
          <v-col cols="8">
            <v-file-input
              v-model="file"
              accept="video/*"
              show-size
              label="Click to select video file"
            />
          </v-col>
          <v-col cols="2" class="pl-2">
            <v-btn
              color="primary"
              class="mr-4"
              :loading="uploading"
              @click="uploadFile"
            >
              Upload
              <v-icon right dark>mdi-cloud-upload</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
  <source-url-dialog v-model="sourceDialog" @confirm="handleSourceConfirm" />
  <open-config-dialog
    v-if="openConfig"
    v-model="openConfig"
    :tool="toolName"
    @success="openConfiguration($event)"
  />
  <save-config-dialog
    v-if="saveConfig"
    v-model="saveConfig"
    :tool="toolName"
    @success="saveConfiguration($event)"
  />
</template>

<script>
import Hls from 'hls.js'
import {
  OpenConfigDialog,
  SaveConfigDialog,
  TopBar,
} from '@openc3/vue-common/components'
import { Api, axios, OpenC3Api } from '@openc3/js-common/services'
import { createPlaylistBlobUrl, pLoader } from './playlistProcessing'
import SourceUrlDialog from './SourceUrlDialog.vue'

const hlsPlaylistFilenameRegex = /\.m3u8$/
const urlRegex =
  /^([-a-zA-Z]+:\/\/)[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/

export default {
  components: {
    TopBar,
    OpenConfigDialog,
    SaveConfigDialog,
    SourceUrlDialog,
  },
  props: {
    widgetConfig: {
      type: String,
      default: null,
    },
  },
  data: function () {
    return {
      api: new OpenC3Api(),
      file: null,
      hls: new Hls({
        pLoader,
      }),
      source: {},
      sourceDialog: false,
      uploadDialog: false,
      uploading: false,
      openConfig: false,
      saveConfig: false,
    }
  },
  computed: {
    title: function () {
      return 'Video Player'
    },
    toolName: function () {
      return 'video-player'
    },
    videoStyle: function () {
      return 'max-height: calc(100vh - 118px)'
    },
    menus: function () {
      return [
        {
          label: 'File',
          items: [
            {
              label: 'Open Configuration',
              command: () => {
                this.openConfig = true
              },
            },
            {
              label: 'Save Configuration',
              command: this.openSaveDialog,
            },
            {
              divider: true,
            },
            {
              label: 'New Source',
              command: () => {
                this.sourceDialog = true
              },
            },
            {
              label: 'Upload Video',
              command: () => {
                this.uploadDialog = true
              },
            },
          ],
        },
      ]
    },
  },
  watch: {
    source: {
      immediate: true,
      handler: function (newVal, oldVal) {
        if (oldVal && oldVal.type !== 'static') {
          // clean up the old hls stream if there is one so the player is ready for a new one
          this.hls.detachMedia()
        }
        if (newVal.type !== 'static') {
          this.$nextTick(() => {
            this.hls.loadSource(newVal.url)
            this.hls.attachMedia(this.$refs.video)
            this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
              this.$refs.video.play()
            })
          })
        }
      },
    },
  },
  mounted: function () {
    if (this.widgetConfig) {
      this.openConfiguration(this.widgetConfig, false)
    } else if (localStorage['lastconfig__video_player']) {
      this.openConfiguration(localStorage['lastconfig__video_player'])
    }
  },
  beforeUnmount: function () {
    this.revokeUrls()
  },
  methods: {
    handleSourceConfirm: function (url) {
      this.source = {
        url: url,
        type: this.hlsOrStatic(url),
      }
    },
    hlsOrStatic: function (url) {
      // blob type has no extension, but we already know if we're using a blob or not
      return url.match(hlsPlaylistFilenameRegex) ? 'hls' : 'static'
    },
    loadFile: async function (filename) {
      const { data: presignedRequest } = await Api.get(
        `/cosmos-api/storage/download/${filename}`,
      )
      this.source = {
        url: presignedRequest.url,
        type: 'static',
      }
    },
    uploadFile: async function () {
      this.uploading = true
      try {
        const { data: presignedRequest } = await Api.get(
          `/cosmos-api/storage/upload/${this.file.name}`,
        )
        const response = await axios({
          ...presignedRequest,
          data: this.file,
          timeout: 2 * 60 * 1000, // allow 2 minutes for big files or slow connections
        })
        if (response.status === 200) {
          const config = JSON.stringify({
            filename: this.file.name,
          })
          await this.saveConfiguration(this.file.name, config)
          await this.openConfiguration(this.file.name)
          this.uploadDialog = false
          this.file = null
        } else {
          this.$dialog.alert('Error uploading file.', {
            okText: 'OK',
          })
        }
      } catch (e) {
        this.$dialog.alert(`Error uploading file: ${e.message}`, {
          okText: 'OK',
        })
      } finally {
        this.uploading = false
      }
    },
    openSaveDialog: function () {
      if (this.source.type === 'blob') {
        this.$dialog.alert(
          "Can't save this configuration because it is created by the stream transcoder",
          {
            okText: 'OK',
          },
        )
      } else {
        this.saveConfig = true
      }
    },
    saveConfiguration: async function (name, content = this.source.url) {
      localStorage['lastconfig__video_player'] = name
      await this.api.save_config(this.toolName, name, content)
    },
    openConfiguration: async function (name, remember = true) {
      this.revokeUrls()
      if (remember) localStorage['lastconfig__video_player'] = name
      const response = await this.api.load_config(this.toolName, name)
      if (response) {
        if (response.match(urlRegex)) {
          // response is something that's hosted elsewhere
          this.source = {
            url: response,
            type: this.hlsOrStatic(response),
          }
        } else {
          const json = JSON.parse(response)
          if ('manifest' in json) {
            // response is encoded m3u8 files
            this.source = {
              url: createPlaylistBlobUrl(json.manifest),
              type: 'blob',
            }
          } else {
            // response is a file in S3 that needs to be loaded with a presigned request
            await this.loadFile(json.filename)
          }
        }
      }
    },
    revokeUrls: function () {
      if (this.source.type === 'blob') {
        URL.revokeObjectURL(this.source.url)
      }
    },
  },
}
</script>
