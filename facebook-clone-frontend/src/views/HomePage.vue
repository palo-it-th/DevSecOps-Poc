<template>
  <div class="home">
    <h2>Welcome to the Facebook Clone</h2>
    <p>This is a simple clone of Facebook with basic features like user registration, login, creating posts, and viewing posts.</p>
    <router-link to="/register">
      <button>Register Now</button>
    </router-link>
    <router-link to="/login">
      <button>Login</button>
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'HomePage',
};
</script>

<style scoped>
.home {
  text-align: center;
  padding: 20px;
}
button {
  margin: 10px;
  padding: 10px 20px;
  background-color: #4267b2;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
button:hover {
  background-color: #365899;
}
</style>
