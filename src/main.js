import { createApp } from 'vue';
import App from './App.vue';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'vuetify/styles'
import 'vuetify/dist/vuetify.min.css';
import router from './route'

const app = createApp(App);

const vuetify = createVuetify({
    components,
    directives
});

app.use(vuetify);
app.use(router)

app.mount('#app');
