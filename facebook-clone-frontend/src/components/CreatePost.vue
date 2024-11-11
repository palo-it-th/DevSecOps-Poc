<template>
  <div>
    <h2>Create Post</h2>
    <form @submit.prevent="createPost">
      <textarea v-model="content" placeholder="What's on your mind?" required></textarea>
      <button type="submit">Post</button>
    </form>
  </div>
</template>

<script>
import apiClient from 'axios';

export default {
  data() {
    return {
      content: '',
    };
  },
  methods: {
    async createPost() {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) {
        alert('Please login first.');
        return;
      }

      try {
        await apiClient.post('/post', {
          user_id: user.id,
          content: this.content,
        });
        alert('Post created.');
        this.content = '';
        this.$emit('postCreated');
      } catch (error) {
        alert('Failed to create post.');
      }
    },
  },
};
</script>
