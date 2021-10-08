/*
# Copyright 2021 Ball Aerospace & Technologies Corp.
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
*/

import Hls from 'hls.js'
import { CosmosApi } from '@cosmosc2/tool-common/src/services/cosmos-api'
import { createPlaylistBlobUrl } from '.'

export default class extends Hls.DefaultConfig.loader {
  constructor(config) {
    super(config)
    this.blobUrl = null // Used to revoke object URLs created by the loader
    this.api = new CosmosApi()
    const load = this.load.bind(this)
    this.load = function (context, config, callbacks) {
      if (context.type == 'manifest') {
        load(context, config, callbacks) // VideoPlayer.vue is responsible for processing the manifest
      } else {
        // Get the playlist data from redis
        this.api
          .load_config('video-player', localStorage['lastconfig__video_player']) // That gets set by VideoPlayer.vue when the user changes streams
          .then((toolConfig) => {
            // Revoke the old URL because it's no longer needed
            URL.revokeObjectURL(this.blobUrl)
            // Create a blob for the playlist and load that instead
            context.url = this.blobUrl = createPlaylistBlobUrl(
              JSON.parse(toolConfig).indexes[
                context.url.substring(context.url.lastIndexOf('/') + 1)
              ]
            )
            load(context, config, callbacks)
          })
      }
    }
  }
}
