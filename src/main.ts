
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import '@/assets/styles/main.css'
import App from './App.vue'
import router from './router'
import 'md-editor-v3/lib/style.css'
const app = createApp(App)
app.use(ElementPlus)

app.use(createPinia())
app.use(router)
app.mount('#app')

