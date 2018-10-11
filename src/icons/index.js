import Vue from 'vue'
import SvgIcon from '@/components/SvgIcon'
import PropsExample from '@/components/Props'

// register globally
Vue.component('svg-icon', SvgIcon)
Vue.component('individual-comment', PropsExample)

const requireAll = requireContext => requireContext.keys().map(requireContext)
const req = require.context('./svg', false, /\.svg$/)
requireAll(req)
