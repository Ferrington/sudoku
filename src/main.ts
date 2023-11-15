import '@/assets/css/main.css';

import { createPinia } from 'pinia';
import { createApp } from 'vue';
import App from './App.vue';
//@ts-ignore
import vClickOutside from 'click-outside-vue3';

const app = createApp(App);

app.use(createPinia());
app.use(vClickOutside);

app.mount('#app');
