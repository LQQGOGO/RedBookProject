import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import App from './App.vue'
import router from './router'
import '@/assets/basic.css'
import persist from 'pinia-plugin-persistedstate'
import '@/styles/common.less'

const app = createApp(App)

app.use(ElementPlus)
app.use(createPinia().use(persist))
app.use(router)

app.mount('#app')
