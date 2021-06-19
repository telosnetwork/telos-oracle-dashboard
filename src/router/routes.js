const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/Index.vue") }]
  },{
    path: "/oracle",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/Oracle.vue") }]
  },{
    path: "/oraclesimple",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/OracleSimple.vue") }]
  },{
    path: "/leaderboard",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/Leaderboard.vue") }]
  },{
    path: "/rng",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/RNG.vue") }]
  },{
    path: "/rngsimple",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/RNGSimple.vue") }]
  },


  // Always leave this as last one,
  // but you can also remove it
  {
    path: "*",
    component: () => import("pages/Error404.vue")
  }
];

export default routes;
