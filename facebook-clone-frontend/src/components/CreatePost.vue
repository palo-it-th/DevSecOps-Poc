<template>
    <div>
      <h2>Create Post</h2>
      <textarea v-model="content" placeholder="What's on your mind?"></textarea>
      <button @click="handleCreatePost">Post</button>
    </div>
  </template>
  
  <script>
  import { createPost } from '@/api/apiClient';
  
  export default {
    data() {
      return {
        content: '',
      };
    },
    methods: {
      async handleCreatePost() {
        try {
          const user = JSON.parse(localStorage.getItem('user'));
          await createPost({ user_id: user.id, content: this.content });
          this.content = '';
          this.$router.push('/');
        } catch (error) {
          alert('Failed to create post: ' + error.response.data.error);
        }
      },
    },
  };
  </script>
  