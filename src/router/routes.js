const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/Index.vue") }]
  },
  {
    path: "/requestrng",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/RequestRNG.vue") }]
  },{
    path: "/telos-trail",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/RNG.vue") }]
  },{
    path: "/transfer",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/Transfer.vue") }]
  },{
    path: "/streaming",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/Streaming.vue") }]
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
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "*",
    component: () => import("pages/Error404.vue")
  }
];

export default routes;
