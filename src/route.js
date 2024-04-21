import SignupFormVue from './components/SignupForm.vue'
import { createRouter, createWebHistory } from 'vue-router';
import LoginForm from './components/LoginForm.vue'


const routes = [
    {
        path: '/',
        name: 'Signup',
        component: SignupFormVue
    },
    {
        path: '/login',
        name: 'Login',
        component: LoginForm
    }
]


const router = createRouter({
    history: createWebHistory(window.baseUrl),
    routes,
});

export default router;