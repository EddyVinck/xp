const startupScreen: HTMLElement = document.querySelector(".startup-screen");

setTimeout(() => {
  startupScreen.parentNode.removeChild(startupScreen);
}, 7000);
