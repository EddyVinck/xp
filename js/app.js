import "./right-click";
import isChildElement from "./utils/isChildElement";
import File from "./File";

// Add a few folders or files
if (Array.from(document.querySelectorAll(".wallpaper-grid > .cell")).length === 0) {
  const testFile = new File({ name: "My test file", type: "folder" });
  for (let index = 0; index <= 3; index++) {
    new File({ name: `My test file (${index})`, type: "folder" });
  }
}

const folder = document.querySelector(".folder-window");
const topBar = folder.querySelector(".top-bar");
let isMaximize = false;
let originalOffsetLeft;
let originalOffsetTop;

folder.addEventListener("mousedown", e => {
  const isClickingOnTopBar = isChildElement(e.target, topBar) || e.target === topBar;

  // Drag and drop
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

  // Maximize
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

  // Add to taskbar
  const taskbar = document.querySelector("ul.taskbar");

  // Minimize
  const minimizeButton = document.querySelector(".top-bar-button.minimize");
  if (e.target == minimizeButton) {
    console.log("minimize!");
  }

  // The browser has its own drag and drop API, this resolves conflicts with that api
  folder.ondragstart = function() {
    return false;
  };
});
