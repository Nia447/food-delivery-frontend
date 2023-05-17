import { Router, url } from "./router.js";
export { loadBasket, postDishBasket, deleteDishBasket };

async function getBasket() {
  let jwt = localStorage.getItem("jwt-token");
  if (!jwt) return null;
  try {
    let response = await fetch(`${url}/basket`, {
      method: "GET",
      headers: {
        contentType: "application/json",
        Accept: "*/*",
        Authorization: "Bearer " + jwt,
      },
    });
    return await response.json();
  } catch {
    return null;
  }
}

async function postDishBasket(id) {
  let jwt = localStorage.getItem("jwt-token");
  if (!jwt) return null;
  try {
    await fetch(`${url}/basket/dish/` + id, {
      method: "POST",
      headers: {
        contentType: "application/json",
        Accept: "*/*",
        Authorization: "Bearer " + jwt,
      },
    });
  } catch {
    alert("Ошибка");
  }
}

async function deleteDishBasket(id, increase) {
  let jwt = localStorage.getItem("jwt-token");
  if (!jwt) return null;
  try {
    let fetchUrl = `${url}/basket/dish/` + id;
    if (increase == true) {
      fetchUrl += "?increase=true";
    }

    await fetch(fetchUrl, {
      method: "DELETE",
      headers: {
        contentType: "application/json",
        Accept: "*/*",
        Authorization: "Bearer " + jwt,
      },
    });
  } catch {
    alert("Ошибка");
  }
}

async function loadBasket() {
  let json = await getBasket();
  $(".basket").empty();
  let template = $("#card-template-basket");
  for (let i = 0; i < json.length; i++) {
    let block = template.clone();
    block.find("#numberDishBasket").text(i + 1 + ".");
    block.find(".card-title").text(json[i].name);
    block.find(".card-price").text("Цена на - " + json[i].price);
    block.find(".card-img").attr("src", json[i].image);
    block.find("#card-amount").val(json[i].amount);
    block.attr("prevVal", json[i].amount);
    block.find("#card-minus").on("click", function (e) {
      if ($("#card-amount").val() == 0) {
        deleteDishBasket(json[i].id, true);
        Router.dispatch("/cart");
        e.preventDefault();
      } else {
        deleteDishBasket(json[i].id, false);
        block.find("#card-amount").val(block.find("#card-amount").val() - 1);
        Router.dispatch("/cart");
        e.preventDefault();
      }
    });
    block.find("#card-plus").on("click", function (e) {
      postDishBasket(json[i].id);
      block.find("#card-amount").val(block.find("#card-amount").val() + 1);
      Router.dispatch("/cart");
      e.preventDefault();
    });
    block.find("#deleteButton").on("click", function (e) {
      deleteDishBasket(json[i].id, true);
      Router.dispatch("/cart");
      e.preventDefault();
    });

    $(".basket").append(block);
  }
}
