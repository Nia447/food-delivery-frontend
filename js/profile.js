import { initNavigation, Router, url } from "./router.js";
import { checkUser } from "./authorization.js";
export { loadProfile };

async function editProfile(array) {
  console.log("array profile");
  console.log(array);
  let fullName = array[0].value,
    birthDate = array[2].value,
    gender = array[4].value == "Мужской" ? "Male" : "Female",
    address = array[5].value,
    phoneNumber = array[6].value,
    jwt = localStorage.getItem("jwt-token");
  console.log(jwt);
  if (!jwt) return;
  try {
    let response = await fetch(`${url}/account/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
        Authorization: "Bearer " + jwt,
      },
      body: JSON.stringify({
        fullName: fullName,
        birthDate: birthDate + "T00:00:00.000Z",
        gender: gender,
        address: address,
        phoneNumber: phoneNumber,
      }),
    });
    console.log(response);
    if (response.ok) Router.dispatch(`/profile`);
  } catch {
    alert("Error");
  }
}

async function loadProfile() {
  let User = await checkUser();
  if (User != null) {
    console.log(User);
    $("#profileFIO").val(User.fullName);
    $("#profileEmail").val(User.email);
    $("#profileDOB").val(User.birthDate.slice(0, 10));
    $("#profileGender").val(User.gender == "Male" ? "Мужской" : "Женский");
    $("#profileGenderEdit").val(User.gender == "Male" ? "Мужской" : "Женский");
    $("#profileAddress").val(User.address);
    $("#profilePhoneNumber").val(User.phoneNumber);

    $("#editProfileButton").on("click", function (e) {
      $("#editProfileButton").addClass("d-none");
      $("#saveProfileButton").removeClass("d-none");
      $("#profileFIO").removeAttr("readonly");
      $("#profileDOB").removeAttr("readonly");
      $("#profileGender").addClass("d-none");
      $("#profileGenderEdit").removeClass("d-none");
      $("#profileAddress").removeAttr("readonly");
      $("#profilePhoneNumber").removeAttr("readonly");
      e.preventDefault();
    });

    $("#profile-form").submit(function (e) {
      let array = $("#profile-form").serializeArray();
      let birthDate = array[2].value;
      if (Date.parse(birthDate) > Date.now())
        $("#profileError").text("Неправильная дата рождения");
      editProfile(array);
      $("#editProfileButton").removeClass("d-none");
      $("#saveProfileButton").addClass("d-none");
      $("#profileFIO").attr("readonly");
      $("#profileDOB").attr("readonly");
      $("#profileGender").removeClass("d-none");
      $(".profileGenderEdit").addClass("d-none");
      $("#profileAddress").attr("readonly");
      $("#profilePhoneNumber").attr("readonly");
      e.preventDefault();
    });
  }
}
