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
*/

import './set-public-path'
import Vue from 'vue'
import VuejsDialog from 'vuejs-dialog'
import singleSpaVue from 'single-spa-vue'

import App from './App.vue'
import router from './router'
import store from './store'

// Register these globally so they don't have to be imported every time
import AstroBadge from '@cosmosc2/tool-common/src/components/icons/AstroBadge'
import AstroBadgeIcon from '@cosmosc2/tool-common/src/components/icons/AstroBadgeIcon'
Vue.component('astro-badge', AstroBadge)
Vue.component('astro-badge-icon', AstroBadgeIcon)

Vue.config.productionTip = false

import '@cosmosc2/tool-common/src/assets/stylesheets/layout/layout.scss'
import vuetify from './plugins/vuetify'
import 'vuejs-dialog/dist/vuejs-dialog.min.css'
import PortalVue from 'portal-vue'

Vue.use(PortalVue)
Vue.use(VuejsDialog)

const vueLifecycles = singleSpaVue({
  Vue,
  appOptions: {
    router,
    store,
    vuetify,
    render(h) {
      return h(App, {
        props: {},
      })
    },
    el: '#cosmos-tool',
    router,
  },
})

export const bootstrap = vueLifecycles.bootstrap
export const mount = vueLifecycles.mount
export const unmount = vueLifecycles.unmount
