import isChildElement from "./utils/isChildElement";
import getParentWithClass from "./utils/getParentWithClass";
import coalesce from "./utils/coalesce";
import { IFileElement } from "./types/app";

const rightClickMenu: IFileElement | null = document.querySelector(".right-click-menu");

document.addEventListener(
  "contextmenu",
  (e: MouseEvent) => {
    e.preventDefault();

    handleRightClick(e);
  },
  false
);

document.addEventListener("click", (e: MouseEvent) => {
  if (rightClickMenu) {
    if (isChildElement(<HTMLElement>e.target, rightClickMenu)) {
      // handle any of the right click options if those are clicked
      console.log(e.target);

      // get the file from the parent
      if (e.target instanceof HTMLElement && e.target.parentNode) {
        const file = (<IFileElement>e.target.parentNode).file;
      }
    } else {
      // close the right click menu if the user clicked anywhere else
      rightClickMenu.style.display = "none";
    }
  }
});

function handleRightClick(e: MouseEvent) {
  const rightClickMenu: IFileElement | null = document.querySelector(".right-click-menu");
  const { pageX: x, pageY: y } = e;

  // check which instance of File is associated with the element.
  if (e.target instanceof HTMLElement && rightClickMenu instanceof HTMLElement) {
    const elementType: IFileElement = coalesce(
      // Check for cell inside a taskbar
      getParentWithClass(e.target, "taskbar") && getParentWithClass(e.target, "cell"),

      // Check for a cell on the desktop
      getParentWithClass(e.target, "cell")
    );
    // Check if elementType has an associated file
    if (elementType !== null && elementType.file) {
      console.log(elementType.file);
      // Bind the file to the right-click options
      rightClickMenu.file = elementType.file;
    } else {
      // element has no associated File
      // Remove the current file from the right click options if there is one
    }

    // Place the right click options
    rightClickMenu.style.top = `${y}px`;
    rightClickMenu.style.left = `${x}px`;
    rightClickMenu.style.display = "block";
  }
}
