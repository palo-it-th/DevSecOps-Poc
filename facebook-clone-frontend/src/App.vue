<template>
  <div id="app">
    <header>
      <h1>Facebook Clone</h1>
      <nav>
        <router-link to="/">Home</router-link> |
        <router-link to="/register">Register</router-link> |
        <router-link to="/login">Login</router-link> |
        <router-link to="/create-post">Create Post</router-link> |
        <router-link to="/posts">View Posts</router-link>
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
</style>
