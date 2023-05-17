import { Router, initNavigation } from "./router.js";

$(function () {
  Router.init();
  initNavigation();
  Router.dispatch("/?page=1&vegetarian=true");
});
