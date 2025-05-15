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

import { createApp, h } from 'vue'
import singleSpaVue from 'single-spa-vue'

import App from './App.vue'
import router from './router'
import { Dialog, Notify, store, vuetify } from '@openc3/vue-common/plugins'

// Register these globally so they don't have to be imported every time
// import AstroBadge from '@cosmosc2/tool-common/src/components/icons/AstroBadge'
// import AstroBadgeIcon from '@cosmosc2/tool-common/src/components/icons/AstroBadgeIcon'
// Vue.component('astro-badge', AstroBadge)
// Vue.component('astro-badge-icon', AstroBadgeIcon)

const vueLifecycles = singleSpaVue({
  createApp,
  appOptions: {
    render() {
      return h(App, {})
    },
    el: '#openc3-tool',
  },
  handleInstance: (app) => {
    app.use(router)
    app.use(store)
    app.use(vuetify)
    app.use(Dialog)
    app.use(Notify, { store })
  },
})

export const bootstrap = vueLifecycles.bootstrap
export const mount = vueLifecycles.mount
export const unmount = vueLifecycles.unmount
