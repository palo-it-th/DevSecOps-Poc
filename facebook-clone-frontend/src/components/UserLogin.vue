<template>
  <div>
    <h2>Login</h2>
    <form @submit.prevent="handleLogin">
      <input v-model="username" placeholder="Username" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <button type="submit">Login</button>
    </form>
  </div>
</template>

<script>
import { login, setUser } from '@/api/apiClient';

export default {
  data() {
    return {
      username: '',
      password: '',
    };
  },
  methods: {
    async handleLogin() {
      try {
        const response = await login({ username: this.username, password: this.password });
        setUser(response.data);
        this.$router.push('/');
      } catch (error) {
        alert('Login failed: ' + error.response.data.error);
      }
    },
  },
};
</script>
