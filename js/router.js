import { checkUser, userLogout } from "./authorization.js";
import { loadRegistration } from "./registration.js";
import { loadAuthorization } from "./authorization.js";
import { loadProfile } from "./profile.js";
import { loadDishes } from "./menu.js";
import { loadDish } from "./dish.js";
import { loadBasket } from "./basket.js";
import { loadOrders } from "./orders.js";
export { Router, updatePage, initNavigation, url };

let Router = {
  routes: {
    "/?.*": "initMenu",
    "/registration": "initRegistration",
    "/login": "initLogin",
    "/profile": "initProfile",
    "/item/:id": "initDish",
    "/cart": "initBasket",
    "/orders": "initOrders",
  },

  init: function () {
    this._routes = [];
    for (let route in this.routes) {
      let method = this.routes[route];
      if (this.routes[route] == "initMenu") {
        this._routes.push({
          pattern: new RegExp("^" + route),
          callback: this[method],
        });
      } else {
        this._routes.push({
          pattern: new RegExp("^" + route.replace(/:\w+/g, "([\\w+-]+)") + "$"),
          callback: this[method],
        });
      }
    }
  },

  dispatch: function (path) {
    var i = this._routes.length;
    while (i--) {
      var args = path.match(this._routes[i].pattern);
      if (args) {
        if (i == 0) {
          this._routes[i].callback.apply(this, args.slice(0));
        } else {
          this._routes[i].callback.apply(this, args.slice(1));
        }
        history.pushState({}, null, path);
        break;
      }
    }
  },

  initRegistration: function () {
    $.get("../html/registration.html", function (data) {
      $("#mainContainer").html(data);
      updatePage();
      $(".registration").removeClass("d-none");
      loadRegistration();
    });
  },

  initLogin: function () {
    $.get("../html/authorization.html", function (data) {
      $("#mainContainer").html(data);
      updatePage();
      $(".authorization").removeClass("d-none");
      loadAuthorization();
    });
  },

  initProfile: function () {
    $.get("../html/profile.html", function (data) {
      $("#mainContainer").html(data);
      updatePage();
      $(".profile").removeClass("d-none");
      loadProfile();
    });
  },

  initMenu: function (json) {
    $.get("../html/menu.html", function (data) {
      $("#mainContainer").html(data);
      updatePage();
      $(".menu").removeClass("d-none");
      $("#menu-container").removeClass("d-none");
      $(".page-list").removeClass("d-none");
      loadDishes(json);
    });
  },

  initDish: function (id) {
    $.get("../html/dish.html", function (data) {
      $("#mainContainer").html(data);
      loadDish(id);
    });
  },

  initBasket: function () {
    $.get("../html/basket.html", function (data) {
      $("#mainContainer").html(data);
      updatePage();
      $(".basket").removeClass("d-none");
      loadBasket();
    });
  },

  initOrders: function () {
    $.get("../html/orders.html", function (data) {
      $("#mainContainer").html(data);
      updatePage();
      $(".orders").removeClass("d-none");
      loadOrders();
    });
  },
};

function updatePage() {
  $(".registration").addClass("d-none");
  $(".authorization").addClass("d-none");
  $(".profile").addClass("d-none");
  $(".menu").addClass("d-none");
  $(".dish").addClass("d-none");
  $(".basket").addClass("d-none");
  $(".orders").addClass("d-none");
}

async function initNavigation() {
  $("#menu-part").on("click", function (e) {
    Router.dispatch("/?page=1");
    e.preventDefault();
  });

  $("#order-part").on("click", function (e) {
    Router.dispatch("/orders");
    e.preventDefault();
  });

  $("#basket-part").on("click", function (e) {
    Router.dispatch("/cart");
    e.preventDefault();
  });

  $("#registration-part").on("click", function (e) {
    Router.dispatch("/registration");
    e.preventDefault();
  });

  $("#authorization-part").on("click", function (e) {
    Router.dispatch("/login");
    e.preventDefault();
  });

  $("#name-part").on("click", function (e) {
    Router.dispatch("/profile");
    e.preventDefault();
  });

  $("#logout-part").on("click", function (e) {
    userLogout();
  });

  let User = await checkUser();
  if (User != null) {
    $("#order-part").removeClass("d-none");
    $("#basket-part").removeClass("d-none");
    $("#logout-part").removeClass("d-none");
    $("#registration-part").addClass("d-none");
    $("#authorization-part").addClass("d-none");
    $("#name-part").text(User.email).removeClass("d-none");
  } else {
    $("#order-part").addClass("d-none");
    $("#basket-part").addClass("d-none");
    $("#logout-part").addClass("d-none");
    $("#registration-part").removeClass("d-none");
    $("#authorization-part").removeClass("d-none");
    $("#name-part").text("").addClass("d-none");
  }
}

let url = "https://food-delivery.kreosoft.ru/api";
