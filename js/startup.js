const startupScreen = document.querySelector(".startup-screen");

setTimeout(() => {
  startupScreen.parentNode.removeChild(startupScreen);
}, 7000);
