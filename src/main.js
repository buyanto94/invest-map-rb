import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import store from './store'
import './assets/styles/index.scss'

const app = createApp(App)

app.use(createPinia())
app.use(store)

app.mount('#app')