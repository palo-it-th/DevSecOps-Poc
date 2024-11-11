<template>
  <div>
    <h2>Login</h2>
    <form @submit.prevent="login">
      <input v-model="username" placeholder="Username" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <button type="submit">Login</button>
    </form>
  </div>
</template>

<script>
import apiClient from 'axios';

export default {
  data() {
    return {
      username: '',
      password: '',
    };
  },
  methods: {
    async login() {
      try {
        const response = await apiClient.post('/login', {
          username: this.username,
          password: this.password,
        });
        localStorage.setItem('user', JSON.stringify(response.data));
        alert('Login successful');
        this.$router.push('/');
      } catch (error) {
        alert('Invalid credentials.');
      }
    },
  },
};
</script>
