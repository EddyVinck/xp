import isChildElement from "./utils/isChildElement";

class Folder {
  constructor() {
    this.innerFolders = [];
    this.innerFiles = [];
  }
}

const folder = document.querySelector(".folder-opened");
const topBar = folder.querySelector(".top-bar");

folder.addEventListener("mousedown", e => {
  const isClickingOnTopBar = isChildElement(e.target, topBar) || e.target === topBar;

  if (isClickingOnTopBar) {
    function moveAt(x, y) {
      folder.style.left = x - shiftX + "px";
      folder.style.top = y - shiftY + "px";
    }

    function onMouseMove(event) {
      moveAt(event.pageX, event.pageY);
    }

    // Get the current position of the cursor relative to the folder
    let shiftX = e.clientX - folder.getBoundingClientRect().left;
    let shiftY = e.clientY - folder.getBoundingClientRect().top;

    folder.style.position = "absolute";
    folder.style.zIndex = 1000;

    // Append the folder to the body so the absolute positioning is relative to the body
    document.body.append(folder);
    document.addEventListener("mousemove", onMouseMove);

    // Clear event listeners when the element is released
    folder.onmouseup = () => {
      document.removeEventListener("mousemove", onMouseMove);
      folder.mouseup = null;
    };
  }

  // The browser has its own drag and drop API, this resolves conflicts with that api
  folder.ondragstart = function() {
    return false;
  };
});
