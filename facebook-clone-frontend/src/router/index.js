import CreatePost from "@/components/CreatePost.vue";
import PostList from "@/components/PostList.vue";
import RegisterUser from "@/components/RegisterUser.vue";
import UserLogin from "@/components/UserLogin.vue";
import { createRouter, createWebHistory } from "vue-router";
import HomePage from "../views/HomePage.vue";

const routes = [
  { path: "/", name: "Home", component: HomePage },
  { path: "/login", name: "Login", component: UserLogin },
  { path: "/register", name: "Register", component: RegisterUser },
  { path: "/create-post", name: "CreatePost", component: CreatePost },
  { path: "/posts", name: "PostList", component: PostList },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
