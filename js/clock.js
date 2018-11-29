const clock = document.querySelector(".taskbar__clock");

if (clock instanceof HTMLElement) {
  startClock();
}

function startClock() {
  setInterval(() => {
    insertTime(getCurrentTime());
  }, 1000);
}

function getCurrentTime() {
  const currentDate = new Date();
  const currentTime = currentDate.toLocaleTimeString("en-US", {
    hour12: true,
    hour: "numeric",
    minute: "numeric"
  });

  return currentTime;
}

function insertTime(currentTime) {
  const timeLabel = clock.querySelector("span");
  if (timeLabel.innerText !== currentTime) {
    timeLabel.innerText = currentTime;
  }
}
