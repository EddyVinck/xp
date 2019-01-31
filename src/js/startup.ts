const startupScreen = document.querySelector('.startup-screen');
const loginScreen = document.querySelector('.login-screen');

setTimeout(() => {
  if (startupScreen) startupScreen.remove();
}, 7000);

if (process && process.env && process.env.NODE_ENV && process.env.NODE_ENV === 'development') {
  if (startupScreen instanceof HTMLElement && loginScreen instanceof HTMLElement) {
    startupScreen.addEventListener('dblclick', () => {
      startupScreen.remove();
      loginScreen.remove();
    });
  }
}
