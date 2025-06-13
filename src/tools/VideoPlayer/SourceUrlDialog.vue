<!--
# Copyright 2025 OpenC3, Inc.
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
# This file may also be used under the terms of a commercial license
# if purchased from OpenC3, Inc.
-->

<template>
  <v-dialog v-model="dialog" max-width="500">
    <v-card>
      <v-card-title> Change Source </v-card-title>
      <v-card-text>
        <span> Switch the player to a different source URL </span>
        <v-text-field
          v-model="url"
          label="Source URL"
          placeholder="Enter URL"
          hint="Type or paste the URL to the video or stream and click Switch"
          persistent-hint
        />
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="cancel"> Cancel </v-btn>
        <v-btn color="primary" @click="confirm"> Switch </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue', 'confirm', 'cancel'],
  data() {
    return {
      url: '',
    }
  },
  computed: {
    dialog: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      },
    },
  },
  methods: {
    confirm() {
      this.$emit('confirm', this.url)
      this.url = ''
      this.dialog = false
    },
    cancel() {
      this.$emit('cancel')
      this.url = ''
      this.dialog = false
    },
  },
}
</script>
