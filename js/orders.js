import { Router, url } from "./router.js";
export { loadOrders };

async function getOrders() {
  let jwt = localStorage.getItem("jwt-token");
  if (!jwt) return null;
  try {
    let response = await fetch(`${url}/order`, {
      method: "GET",
      headers: {
        contentType: "application/json",
        Accept: "*/*",
        Authorization: "Bearer " + jwt,
      },
    });
    return await response.json();
  } catch {
    alert("Ошибка");
  }
}

async function loadOrders() {
  let json = await getOrders();
  $(".orders").empty();
  let template = $("#card-template-orders");

  for (let i = 0; i < json.length; i++) {
    console.log(json[i]);
    let block = template.clone();
    block.find("#orderDate").text("Заказ от " + json[i].orderTime);
    block.find("#orderStatus").text("Статус заказа - " + json[i].status);
    block
      .find("#deliveryTime")
      .text("Доставка ожидается в " + json[i].deliveryTime);
    block
      .find("#orderPrice")
      .text("Стоимость заказа: " + json[i].price + " рублей");
    $(".order").append(block);
  }
}
