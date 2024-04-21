import SignupFormVue from './components/SignupForm.vue'
import { createRouter, createWebHistory } from 'vue-router';
import LoginForm from './components/LoginForm.vue'
import userComponent from './components/usersComponent.vue'


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
    },
    {
        path: '/chat',
        name: 'Chat',
        component: userComponent
    }
]


const router = createRouter({
    history: createWebHistory(window.baseUrl),
    routes,
});

export default router;