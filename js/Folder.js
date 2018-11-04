import isChildElement from "./utils/isChildElement";

class Folder {
  constructor() {
    this.innerFolders = [];
    this.innerFiles = [];
  }
}

const folder = document.querySelector(".folder-opened");
const topBar = folder.querySelector(".top-bar");
let isMaximize = false;
let originalOffsetLeft;
let originalOffsetTop;

folder.addEventListener("mousedown", e => {
  const isClickingOnTopBar = isChildElement(e.target, topBar) || e.target === topBar;

  if (isClickingOnTopBar && !isMaximize) {
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

  const toggleMaximizeButton = document.querySelector(".top-bar-button.maximize");
  if (e.target == toggleMaximizeButton) {
    if (isMaximize) {
      // go small screen
      folder.style.width = "";
      folder.style.height = "";
      folder.style.left = originalOffsetLeft + "px";
      folder.style.top = originalOffsetTop + "px";
      isMaximize = false;
    } else {
      // save the original position
      originalOffsetLeft = folder.offsetLeft;
      originalOffsetTop = folder.offsetTop;

      // go full screen
      folder.style.left = "0px";
      folder.style.top = "0px";
      folder.style.width = "100%";
      folder.style.height = "calc(100vh - 40px)";

      isMaximize = true;
    }
  }

  // The browser has its own drag and drop API, this resolves conflicts with that api
  folder.ondragstart = function() {
    return false;
  };
});
