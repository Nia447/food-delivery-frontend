import { Router, url } from "./router.js";
export { checkUser, loadAuthorization, userLogout };

async function checkUser() {
  let jwt = localStorage.getItem("jwt-token");
  if (!jwt) return;
  try {
    let response = await fetch(`${url}/account/profile`, {
      headers: {
        contentType: "application/json",
        Accept: "*/*",
        Authorization: "Bearer " + jwt,
      },
    });
    let json = await response.json();
    return json;
  } catch {
    localStorage.removeItem("jwt-token");
    return null;
  }
}

async function userAuthorization(array) {
  try {
    let email = array[0].value,
      password = array[1].value;
    if (!email || !password) return;
    let response = await fetch(`${url}/account/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });
    if (response.ok) {
      let json = await response.json();
      localStorage.setItem("jwt-token", json.token);
      location.reload();
    } else $("#incorrect").text("Неправильный логин или пароль");
  } catch {
    alert("Ошибка входа");
  }
}

async function userLogout(array) {
  let jwt = localStorage.getItem("jwt-token");
  localStorage.removeItem("jwt-token");
  location.reload();
  if (!jwt) return;
  await fetch(`${url}/account/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "*/*",
      Authorization: "Bearer" + jwt,
    },
  });
}

function loadAuthorization() {
  $("#formAuthorization").submit(function (e) {
    userAuthorization($("#formAuthorization").serializeArray());
    e.preventDefault();
  });

  $(".registrationAuthorizationButton").on("click", function (e) {
    updatePage();
    Router.dispatch("/registration");
    e.preventDefault();
  });
}
