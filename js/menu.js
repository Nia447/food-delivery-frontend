import { deleteDishBasket, postDishBasket } from "./basket.js";
import { Router, url } from "./router.js";
export { loadDishes };

let fetchUrl;

function loadDishes(array, params = false) {
  let menuUrl = new URL("http://127.0.0.1:5500" + array);
  let page = menuUrl.searchParams.get("page"),
    categories = menuUrl.searchParams.getAll("categories"),
    vegetarian = menuUrl.searchParams.get("vegetarian"),
    sorting = menuUrl.searchParams.get("sorting");

  fetchUrl = new URL(`${url}/dish/`);
  if (page != undefined) fetchUrl.searchParams.set("page", page);
  else fetchUrl.searchParams.set("page", 1);
  for (let i = 0; i < categories.length; i++) {
    fetchUrl += `&categories=${categories[i]}`;
  }
  fetchUrl = new URL(fetchUrl);
  if (vegetarian != undefined)
    fetchUrl.searchParams.set("vegetarian", vegetarian);
  if (sorting != undefined) fetchUrl.searchParams.set("sorting", sorting);

  loadMenuSortCard(categories, sorting, vegetarian);

  $("#applyButton").on("click", function () {
    let newUrl = "/?page=1";
    let arrayCategories = $(`#selectCategories`).val();
    for (let i = 0; i < arrayCategories.length; i++) {
      if (arrayCategories[i] == "All") break;
      newUrl += `&categories=${arrayCategories[i]}`;
    }
    newUrl += `&sorting=${$("#selectSorting").val()}`;

    if ($("#selectVegetarian").is(":checked") == true) {
      newUrl += `&vegetarian=true`;
    }
    Router.dispatch(newUrl);
  });

  fetch(fetchUrl)
    .then((response) => {
      return response.json();
    })
    .then((json) => {
      loadPages(json, page);
      $("#menu-container").empty();
      let template = $("#card-template-menu");
      for (let dish of json.dishes) {
        let block = template.clone();
        block.attr("id", "dish" + dish.id);

        block
          .find(".card-img-top")
          .attr("src", dish.image)
          .on("click", function (e) {
            Router.dispatch(`/item/${dish.id}`);
          })
          .hover(function () {
            $(this).css("cursor", "pointer");
          });

        block
          .find(".card-title")
          .text(dish.name)
          .on("click", function (e) {
            Router.dispatch(`/item8/${dish.id}`);
          })
          .hover(function () {
            $(this).css("cursor", "pointer");
          });

        block.find("#addToBasketButton").on("click", function (e) {
          $(this).addClass("d-none");
          block.find("#numberDishInBasket").removeClass("d-none");
          postDishBasket(dish.id);
          $("#numberDishInBasket").val(1);
          block.attr("prevVal", 1);
        });

        block.find("#numberDishInBasket").on("input", function () {
          if ($(this).val() == 0) {
            $(this).addClass("d-none");
            block.find("#addToBasketButton").removeClass("d-none");
            deleteDishBasket(dish.id, true);
          } else {
            if ($(this).val() > block.attr("prevVal")) {
              postDishBasket(dish.id);
            } else {
              deleteDishBasket(dish.id, false);
            }
            block.attr("prevVal", $(this).val());
          }
        });

        block.find(".card-text").text("Категория блюд - " + dish.category);
        block.find(".card-description").text(dish.description);
        block.find("#card-price").text("Цена - " + dish.price);
        block.find("#star-rating").rating({
          min: 0,
          max: 10,
          step: 1,
          stars: 10,
          size: "xs",
        });
        block.find("#star-rating").rating("update", dish.rating);

        block.hover(
          function () {
            $(this).css("transform", "scale(1.01)");
            $(this).addClass("classWithShadow");
          },
          function () {
            $(this).css("transform", "scale(1)");
            $(this).removeClass("classWithShadow");
          }
        );

        $("#menu-container").append(block);
      }
    });
}

function loadPages(json, page) {
  $(".page-list").empty();
  $(".page-list").append(
    `<li class="list-group-item menu-page" type="button">1</li>`
  );

  $(".menu-page").on("click", function (e) {
    fetchUrl.searchParams.set("page", 1);
    Router.dispatch("/" + fetchUrl.search);
  });

  let template = $(".menu-page");
  if (1 == page) template.css("color", "white").css("background-color", "blue");
  else {
    template
      .css("color", "black")
      .css("background-color", "white")
      .hover(
        function () {
          $(this).css("background-color", "rgb(231, 231, 231)");
        },
        function () {
          $(this).css("background-color", "white").css("color", "black");
        }
      );
  }

  for (let i = 0; i < json.pagination.count - 1; i++) {
    let newPage = template.clone();
    if (i == page - 2)
      newPage.css("color", "white").css("background-color", "blue");
    else {
      newPage
        .css("color", "black")
        .css("background-color", "white")
        .hover(
          function () {
            $(this).css("background-color", "rgb(231, 231, 231)");
          },
          function () {
            $(this).css("background-color", "white").css("color", "black");
          }
        );
    }

    newPage.text(i + 2).on("click", function (e) {
      fetchUrl.searchParams.set("page", i + 2);
      Router.dispatch("/" + fetchUrl.search);
    });
    $(".page-list").append(newPage);
  }
}

function loadMenuSortCard(categories, sorting, vegetarian) {
  $("#selectCategories").children().attr("selected", false);
  for (let i = 0; i < categories.length; i++) {
    $(`#${categories[i]}`).attr("selected", true);
  }

  $("#selectSorting").children().attr("selected", false);
  $(`#${sorting}`).attr("selected", true);

  $("#selectVegetarian").attr("checked", null);
  $("#selectVegetarian").attr("checked", vegetarian == "true" ? 1 : null);
}
