const clock = document.querySelector(".taskbar__clock");

if (clock instanceof HTMLElement) {
  startClock();
}

function startClock(): void {
  setInterval(() => {
    insertTime(getCurrentTime());
  }, 1000);
}

function getCurrentTime(): string {
  const currentDate = new Date();
  const currentTime = currentDate.toLocaleTimeString("en-US", {
    hour12: true,
    hour: "numeric",
    minute: "numeric"
  });

  return currentTime;
}

function insertTime(currentTime: string) {
  const timeLabel = clock.querySelector("span");
  if (timeLabel.innerText !== currentTime) {
    timeLabel.innerText = currentTime;
  }
}
