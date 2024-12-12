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
  // Vulnerable route
  {
    path: "/execute",
    name: "Execute",
    component: {
      template: "<div>{{ result }}</div>",
      data() {
        return {
          result: "",
        };
      },
      created() {
        const userInput = this.$route.query.code;
        this.result = eval(userInput); // Dangerous: eval allows execution of arbitrary code
      },
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
