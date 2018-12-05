import isChildElement from "./utils/isChildElement";
import getParentWithClass from "./utils/getParentWithClass";
import coalesce from "./utils/coalesce";
import { FileElement } from "./types/app";

const rightClickMenu: HTMLElement = document.querySelector(".right-click-menu");

document.addEventListener(
  "contextmenu",
  (e: MouseEvent) => {
    e.preventDefault();

    handleRightClick(e);
  },
  false
);

document.addEventListener("click", (e: MouseEvent) => {
  if (isChildElement(<HTMLElement>e.target, rightClickMenu)) {
    // handle any of the right click options if those are clicked
  } else {
    rightClickMenu.style.display = "none";
  }
});

function handleRightClick(e: MouseEvent) {
  const rightClickMenu: HTMLElement = document.querySelector(".right-click-menu");
  const { pageX: x, pageY: y } = e;

  let elementType: FileElement;

  // check which instance of File is associated with the element.
  if (e.target instanceof HTMLElement) {
    elementType = coalesce(
      // Check for cell inside a taskbar
      getParentWithClass(e.target, "taskbar") && getParentWithClass(e.target, "cell"),

      // Check for a cell on the desktop
      getParentWithClass(e.target, "cell")
    );
  }

  // Check if elementType has an associated file
  if (elementType !== null && elementType.file) {
    console.log(elementType.file);
  } else {
    // element has no associated File
  }

  // Place the right click options
  rightClickMenu.style.top = `${y}px`;
  rightClickMenu.style.left = `${x}px`;
  rightClickMenu.style.display = "block";
}
