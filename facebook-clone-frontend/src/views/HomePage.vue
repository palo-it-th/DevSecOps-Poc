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
    <div>
      <h3>Leave a Comment</h3>
      <form @submit.prevent="submitComment">
        <textarea v-model="comment"></textarea>
        <button type="submit">Submit</button>
      </form>
      <div v-html="submittedComment"></div> <!-- Vulnerable to XSS -->
    </div>
    <div>
      <h3>View User Profile</h3>
      <form @submit.prevent="viewProfile">
        <input v-model="userId" placeholder="Enter User ID" />
        <button type="submit">View Profile</button>
      </form>
      <div v-if="userProfile">
        <h4>User Profile</h4>
        <p>ID: {{ userProfile.id }}</p>
        <p>Username: {{ userProfile.username }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomePage',
  data() {
    return {
      comment: '',
      submittedComment: ''
    };
  },
  methods: {
    submitComment() {
      this.submittedComment = this.comment; // Directly rendering user input, XSS vulnerability
    },
    async viewProfile() {
      try {
        const response = await fetch(`http://localhost:3402/users/${this.userId}`); // Directly accessing user data by ID
        this.userProfile = await response.json();
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    }
  }
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
input {
  margin-top: 10px;
  padding: 10px;
  width: 100%;
}
</style>
