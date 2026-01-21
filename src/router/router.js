import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    component: () => import("@/layout/index.vue"),
    name: "Layout",
    redirect: "/home",
    children: [
      {
        path: "/home",
        component: () => import("@/view/home/index.vue"),
        name: "Home",
      },
      {
        path: "/download",
        component: () => import("@/view/download/index.vue"),
        name: "Download",
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});
// 核心添加：全局后置守卫，路由跳转完成后滚动到顶部
router.afterEach(() => {
  // 优雅地滚动到顶部
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth", // 平滑滚动效果，兼容现代浏览器
  });
});
export default router;
