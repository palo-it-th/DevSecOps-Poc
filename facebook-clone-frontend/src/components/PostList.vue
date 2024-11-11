<template>
  <div>
    <h2>Posts</h2>
    <ul>
      <li v-for="post in posts" :key="post.id">
        <strong>User {{ post.user_id }}:</strong> {{ post.content }}
      </li>
    </ul>
  </div>
</template>

<script>
import apiClient from 'axios';

export default {
  data() {
    return {
      posts: [],
    };
  },
  async created() {
    this.fetchPosts();
  },
  methods: {
    async fetchPosts() {
      const response = await apiClient.get('/posts');
      this.posts = response.data;
    },
  },
};
</script>
