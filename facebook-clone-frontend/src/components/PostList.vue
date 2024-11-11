<template>
    <div class="post-list">
      <h2>All Posts</h2>
      <div v-if="posts.length === 0">No posts available</div>
      <ul>
        <li v-for="post in posts" :key="post.id" class="post-item">
          <strong>{{ post.user_id }}</strong>: {{ post.content }}
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  import { getPosts } from '@/api/apiClient';
  
  export default {
    data() {
      return {
        posts: [],
      };
    },
    async created() {
      await this.fetchPosts();
    },
    methods: {
      async fetchPosts() {
        try {
          const response = await getPosts();
          this.posts = response.data;
        } catch (error) {
          alert('Failed to fetch posts: ' + error.response?.data?.error || error.message);
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .post-list {
    max-width: 600px;
    margin: auto;
  }
  .post-item {
    padding: 10px;
    border-bottom: 1px solid #ddd;
  }
  </style>
  