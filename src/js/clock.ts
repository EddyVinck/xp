const clock = document.querySelector('.taskbar__clock');

function getCurrentTime(): string {
  const currentDate = new Date();
  const currentTime = currentDate.toLocaleTimeString('en-US', {
    hour12: true,
    hour: 'numeric',
    minute: 'numeric',
  });

  return currentTime;
}

function insertTime(currentTime: string): void {
  const timeLabel = clock && clock.querySelector('span');
  if (timeLabel && timeLabel.innerText !== currentTime) {
    timeLabel.innerText = currentTime;
  }
}

function startClock(): void {
  setInterval(() => {
    insertTime(getCurrentTime());
  }, 1000);
}

if (clock && clock instanceof HTMLElement) {
  startClock();
}
