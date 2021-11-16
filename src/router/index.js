import Vue from "vue";
import VueRouter from "vue-router";
import Admin from "../views/Admin.vue";
import Company from "@/components/Company";
import Candle from "@/components/Candle";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Company,
  },
  {
    path:'/company/:id',
    name: 'Candle',
    props:true,
    component: Candle
  },
  {
    path: "/admin",
    name: "Admin Page",
    component: Admin,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
