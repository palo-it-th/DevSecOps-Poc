<template>
  <div>
    <h2>Register</h2>
    <form @submit.prevent="register">
      <input v-model="username" placeholder="Username" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <button type="submit">Register</button>
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
    async register() {
      try {
        const response = await apiClient.post('/register', {
          username: this.username,
          password: this.password,
        });
        alert(`User registered: ${response.data.username}`);
        this.$router.push('/login');
      } catch (error) {
        alert('Registration failed.');
      }
    },
  },
};
</script>
