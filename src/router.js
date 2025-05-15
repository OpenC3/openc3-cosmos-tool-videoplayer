/*
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
*/

import { createRouter, createWebHistory } from 'vue-router'
import { prependBasePath } from '@openc3/js-common/utils'
import { NotFound } from '@openc3/vue-common/components'
import VideoPlayer from './tools/VideoPlayer/VideoPlayer'

const routes = [
  {
    path: '',
    name: 'VideoPlayer',
    component: VideoPlayer,
    meta: { title: 'Video Player', icon: 'mdi-video-box' },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
  },
]

routes.forEach(prependBasePath)

export default createRouter({
  history: createWebHistory(),
  routes,
})
