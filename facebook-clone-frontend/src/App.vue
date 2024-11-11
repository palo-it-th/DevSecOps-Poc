<template>
  <div id="app">
    <header>
      <h1>Facebook Clone</h1>
      <nav>
        <router-link to="/">Home</router-link> |
        <router-link v-if="!isAuthenticated" to="/register">Register</router-link> |
        <router-link v-if="!isAuthenticated" to="/login">Login</router-link> |
        <router-link v-if="isAuthenticated" to="/create-post">Create Post</router-link> |
        <router-link v-if="isAuthenticated" to="/posts">View Posts</router-link> |
        <button v-if="isAuthenticated" @click="logout">Logout</button>
      </nav>
    </header>
    <main>
      <router-view />
    </main>
  </div>
</template>

<script>
export default {
  name: 'App',
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
header {
  background: #3b5998;
  color: white;
  padding: 10px;
}
nav {
  margin-bottom: 20px;
}
a {
  color: #fff;
  text-decoration: none;
  margin: 0 10px;
}
a:hover {
  text-decoration: underline;
}
button {
  background-color: #f0f0f0;
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
}
</style>


