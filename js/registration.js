import { url } from "./router.js";
import { initNavigation } from "./router.js";
export { loadRegistration };

async function userRegister(array) {
  let fullName = array[0].value,
    gender = array[1].value == "Мужской" ? "Male" : "Female",
    phoneNumber = array[2].value,
    birthDate = array[3].value,
    address = array[4].value,
    email = array[5].value,
    password = array[6].value;

  if (Date.parse(birthDate) > Date.now())
    $("#regError").text("Неправильная дата рождения");
  else
    try {
      let response = await fetch(`${url}/account/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
        },
        body: JSON.stringify({
          fullName: fullName,
          gender: gender,
          phoneNumber: phoneNumber,
          birthDate: birthDate + "T00:00:00.000Z",
          address: address,
          email: email,
          password: password,
        }),
      });
      console.log(response);
      if (response.ok) {
        let json = await response.json();
        localStorage.setItem("jwt-token", json.token);
        $("#regError")
          .text("Пользователь зарегистрирован")
          .removeClass("text-danger")
          .addClass("text-success");
        initNavigation();
        Router.dispatch("/1");
      } else $("#regError").text("Возникла ошибка");
    } catch {
      alert("Error");
    }
}

function loadRegistration() {
  $(".registration").removeClass("d-none");
  $("#formRegistration").submit(function (e) {
    userRegister($("#formRegistration").serializeArray());
    e.preventDefault();
  });
}
