<template>
  <div id="app">
    <nav>
      <h1>Facebook Clone</h1>
      <ul>
        <li><router-link to="/">Home</router-link></li>
        <li v-if="!isAuthenticated"><router-link to="/register">Register</router-link></li>
        <li v-if="!isAuthenticated"><router-link to="/login">Login</router-link></li>
        <li v-if="isAuthenticated"><button @click="logout">Logout</button></li>
      </ul>
    </nav>

    <router-view />
  </div>
</template>

<script>
export default {
  data() {
    return {
      isAuthenticated: false,
    };
  },
  created() {
    // Check if the user is already logged in
    this.isAuthenticated = !!localStorage.getItem('user');
  },
  methods: {
    logout() {
      localStorage.removeItem('user');
      this.isAuthenticated = false;
      this.$router.push('/login');
    },
  },
  watch: {
    // React to changes in authentication status
    $route() {
      this.isAuthenticated = !!localStorage.getItem('user');
    },
  },
};
</script>

<style scoped>
#app {
  text-align: center;
}

nav {
  background-color: #4267b2;
  padding: 1rem;
  color: white;
}

nav h1 {
  margin: 0;
}

ul {
  list-style: none;
  padding: 0;
  display: flex;
  gap: 1rem;
  justify-content: center;
}

ul li {
  display: inline;
}

button {
  background-color: #f0f0f0;
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
}
</style>
