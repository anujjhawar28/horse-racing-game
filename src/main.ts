/**
 * Horse Racing Game - Application Entry Point
 * Initializes Vue application with Vuex store
 */
import { createApp } from 'vue';
import { store, key } from './store';
import './style.css';
import App from './App.vue';

// Create and mount the application
const app = createApp(App);

// Use Vuex store
app.use(store, key);

// Mount to DOM
app.mount('#app');
