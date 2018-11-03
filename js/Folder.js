class Folder {
  constructor() {
    this.innerFolders = [];
    this.innerFiles = [];
  }
}

const folder = document.querySelector(".folder-opened");

folder.addEventListener("mousedown", e => {
  const { pageX, pageY } = e;

  // onmousedown
  let shiftX = e.clientX - folder.getBoundingClientRect().left;
  let shiftY = e.clientY - folder.getBoundingClientRect().top;

  folder.style.position = "absolute";
  folder.style.zIndex = 1000;

  document.body.append(folder);

  moveAt(pageX, pageY);

  function onMouseMove(event) {
    moveAt(event.pageX, event.pageY);
  }

  function moveAt(x, y) {
    folder.style.left = x - shiftX + "px";
    folder.style.top = y - shiftY + "px";
  }

  document.addEventListener("mousemove", onMouseMove);

  folder.onmouseup = () => {
    document.removeEventListener("mousemove", onMouseMove);
    folder.mouseup = null;
  };

  folder.ondragstart = function() {
    return false;
  };
});
