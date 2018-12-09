import getParentWithClass from "./utils/getParentWithClass";
import { el } from "redom";

const accounts: HTMLElement[] = Array.from(document.querySelectorAll(".login-screen__account"));
const loginScreen = document.querySelector(".login-screen");

function removeActive(element: HTMLElement) {
  element.classList.remove("active");
}

accounts.forEach(account => {
  account.addEventListener("click", checkActive);
});

// you can provide an explicit this parameter. this parameters are fake parameters that come first in the parameter list of a function:
function checkActive(this: HTMLElement) {
  if (this.classList.contains("active") === false) {
    accounts.forEach(removeActive);
    this.classList.add("active");
  }
}

if (loginScreen instanceof HTMLElement) {
  loginScreen.addEventListener("click", ({ target }) => {
    const loginScreenAccountElement = getParentWithClass(
      <HTMLElement>target,
      "login-screen__account"
    );
    if (loginScreenAccountElement === null) {
      accounts.forEach(removeActive);
    } else {
      const input = loginScreenAccountElement.querySelector("input");
      if (input instanceof HTMLElement) {
        input.focus();
      } else {
        // user did not have a password, log in that user
        logIn(loginScreenAccountElement);
      }
    }
  });

  Array.from(loginScreen.querySelectorAll("form")).forEach(form => {
    form.addEventListener("submit", (e: Event) => {
      e.preventDefault();

      const pw: HTMLInputElement | null =
        e.srcElement && e.srcElement.querySelector("input[type=password]");

      // advanced security system
      if (pw) {
        if (pw.value.toLowerCase() === "1234") {
          const loginScreenAccountElement = getParentWithClass(
            <HTMLElement>e.srcElement,
            "login-screen__account"
          );
          if (loginScreenAccountElement instanceof HTMLElement) {
            logIn(loginScreenAccountElement);
          }
        } else if (pw.value === "") {
          // pw field was empty
          console.log("access denied");
        } else {
          console.log("access denied");
        }

        pw.value = "";
      }
    });
  });
}

function logIn(loginScreenAccountElement: HTMLElement): void {
  const instructionsScreen = document.querySelector(".login-screen__instructions");
  const welcomeText: HTMLElement = el(".welcome-text", "welcome");
  const otherAccounts: HTMLElement[] = accounts.filter(acc => acc !== loginScreenAccountElement);

  otherAccounts.forEach(acc => acc.remove());

  // remove check for active
  loginScreenAccountElement.removeEventListener("click", checkActive);

  // Show welcome text
  if (instructionsScreen instanceof HTMLElement) {
    instructionsScreen.innerHTML = "";
    instructionsScreen.appendChild(welcomeText);
  }

  // remove active class
  loginScreenAccountElement.classList.remove("active");

  // add logging-in class
  loginScreenAccountElement.classList.add("logging-in");

  // Add loading settings text
  const accountDetails = loginScreenAccountElement.querySelector(".login-screen__account-details");

  if (accountDetails) {
    accountDetails.appendChild(el(".loading-settings", "Loading your personal settings"));
  }

  // go to desktop
  setTimeout(() => {
    loginScreen && loginScreen.remove();
  }, 2500);
}
