import parentHasClass from "./utils/parentHasClass";

const accounts = Array.from(document.querySelectorAll(".login-screen__account"));
const loginScreen = document.querySelector(".login-screen");

function removeActive(element) {
  element.classList.remove("active");
}

accounts.forEach(account => {
  account.addEventListener("click", () => {
    if (account.classList.contains("active") === false) {
      accounts.forEach(removeActive);
      account.classList.add("active");
    }
  });
});

loginScreen.addEventListener("click", ({ target }) => {
  if (parentHasClass(target, "login-screen__account") === false) {
    accounts.forEach(removeActive);
  }
});

Array.from(loginScreen.querySelectorAll("form")).forEach(form => {
  form.addEventListener("submit", e => {
    const pw = e.srcElement.querySelector("input[type=password]");
    if (pw.value === "1234") {
      console.log("access granted!");
      pw.value = "";
    } else if (pw.value === "") {
      // no input
      console.log("access denied");
    } else {
      console.log("access denied");
    }

    pw.value = "";

    e.preventDefault();
  });
});
