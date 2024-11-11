import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../views/HomePage.vue';
import RegisterUser from '../components/RegisterUser.vue';
import UserLogin from '../components/UserLogin.vue';

const routes = [
  { path: '/', name: 'Home', component: HomePage },
  { path: '/register', name: 'Register', component: RegisterUser },
  { path: '/login', name: 'Login', component: UserLogin },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
