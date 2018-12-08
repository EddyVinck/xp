const startupScreen = document.querySelector(".startup-screen");

setTimeout(() => {
  if (startupScreen) startupScreen.remove();
}, 7000);
