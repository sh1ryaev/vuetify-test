import Vue from "vue";
import VueRouter from "vue-router";
import TableData from "../components/TableData";
import StaffProfile from "../components/StaffProfile";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: TableData,
  },
  {
    path: "/profile/:staffKey",
    name: "profile",
    component: StaffProfile,
  },
];

const router = new VueRouter({
  routes,
  mode: "history",
});

export default router;
