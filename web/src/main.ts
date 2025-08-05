import '@/assets/base.css';
import { pinia } from "@/stores";
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

const app = createApp(App)

app.use(pinia).use(router)

app.mount('#app')
