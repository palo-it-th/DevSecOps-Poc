<template>
  <div>
    <h1>Facebook Clone</h1>
    <CreatePost @postCreated="refreshPosts" />
    <PostList ref="postList" />
  </div>
</template>

<script>
import CreatePost from '../components/CreatePost.vue';
import PostList from '../components/PostList.vue';

export default {
  components: {
    CreatePost,
    PostList,
  },
  methods: {
    refreshPosts() {
      this.$refs.postList.fetchPosts();
    },
  },
};
</script>
