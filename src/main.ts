import '@/assets/css/main.css';
import 'primeicons/primeicons.css';
import PrimeVue from 'primevue/config';
import 'primevue/resources/themes/lara-light-blue/theme.css';
import Tooltip from 'primevue/tooltip';

import { createPinia } from 'pinia';
import { createApp } from 'vue';
import App from './App.vue';

const app = createApp(App);

app.use(createPinia());
app.use(PrimeVue);
app.directive('tooltip', Tooltip);

app.mount('#app');
