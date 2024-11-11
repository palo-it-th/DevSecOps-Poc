<template>
  <div class="register">
    <h2>Register</h2>
    <form @submit.prevent="handleRegister">
      <div>
        <input v-model="username" type="text" placeholder="Username" required />
      </div>
      <div>
        <input v-model="password" type="password" placeholder="Password" required />
      </div>
      <button type="submit">Register</button>
    </form>
  </div>
</template>

<script>
import { register, setUser } from '@/api/apiClient';

export default {
  data() {
    return {
      username: '',
      password: '',
    };
  },
  methods: {
    async handleRegister() {
      try {
        const response = await register({
          username: this.username,
          password: this.password,
        });
        setUser(response.data);
        alert('Registration successful! Redirecting to home...');
        this.$router.push('/');
      } catch (error) {
        alert('Registration failed: ' + error.response?.data?.error || error.message);
      }
    },
  },
};
</script>

<style scoped>
.register {
  max-width: 400px;
  margin: auto;
}
</style>
