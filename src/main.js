import { createApp } from 'vue'
import './style.css'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'



const app = createApp(App)

app.use(createPinia())
app.use(router) // 2. Collega il router all'applicazione

app.mount('#app')
