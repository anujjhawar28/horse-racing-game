import { createApp, defineAsyncComponent } from 'vue';
import { store, key } from './store';
import './style.css';
import App from './App.vue';

const app = createApp(App);
app.use(store, key);

// Globally register base control components with lazy loading
app.component('BaseButton', defineAsyncComponent(() => import('./components/controls/BaseButton.vue')));
app.component('BaseTabs', defineAsyncComponent(() => import('./components/controls/BaseTabs.vue')));
app.component('BaseBadge', defineAsyncComponent(() => import('./components/controls/BaseBadge.vue')));
app.component('BaseAccordion', defineAsyncComponent(() => import('./components/controls/BaseAccordion.vue')));

app.mount('#app');
