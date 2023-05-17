import { Router, updatePage, url } from "./router.js";
export { loadDish };

function loadDish(id) {
  updatePage();
  $(".dish").removeClass("d-none");

  console.log(`${url}/dish/` + id);

  fetch(`${url}/dish/` + id)
    .then((response) => {
      return response.json();
    })
    .then(async (json) => {
      console.log(json);

      $(".dish").empty();
      $(".dish").removeClass("d-none");

      let template = $("#card-template-dish");
      let block = template.clone();

      block.find(".card-img-top").attr("src", json.image);
      block.find(".card-title").text(json.name);
      block.find(".card-text").text("Категория блюд - " + json.category);
      if (json.vegetarian == true)
        block.find(".card-vegetarian").text("Вегетарианское");
      block.find(".card-description").text(json.description);
      block.find(".card-price").text("Цена - " + json.price);
      block.find("#card-star-rating").rating({
        min: 0,
        max: 10,
        step: 1,
        stars: 10,
        size: "xs",
      });
      block.find("#card-star-rating").rating("update", json.rating);
      block.removeClass("d-none");

      $("#dishConteiner").append(block);
    });
}
