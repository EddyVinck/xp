import isChildElement from "./utils/isChildElement";
import getParentWithClass from "./utils/getParentWithClass";
import coalesce from "./utils/coalesce";
import { IFileElement } from "./types/app";
import { el } from "redom";

const rightClickMenu: IFileElement | null = document.querySelector(".right-click-menu");
const rightClickFileActions = ["Debug", "Delete", "Rename"];

document.addEventListener(
  "contextmenu",
  (e: MouseEvent) => {
    e.preventDefault();

    deleteRightClickOptions(rightClickFileActions);
    handleRightClick(e);
  },
  false
);

document.addEventListener("click", (e: MouseEvent) => {
  if (rightClickMenu) {
    if (isChildElement(<HTMLElement>e.target, rightClickMenu)) {
      // handle any of the right click options if those are clicked

      if (e.target instanceof HTMLElement) {
        // get the file from the parent
        const file = rightClickMenu.file;

        if (file) {
          switch (e.target.innerText.toLowerCase().replace(" ", "-")) {
            case "delete":
              file.delete();
              break;
            case "rename":
              file.rename();
              break;
            case "debug":
              file.debug();
            default:
              break;
          }
        }
      }
    }

    // close the right click menu
    rightClickMenu.style.display = "none";
  }
});

function handleRightClick(e: MouseEvent) {
  const rightClickMenu = <IFileElement>document.querySelector(".right-click-menu");
  const menuList = <HTMLElement>rightClickMenu.querySelector("ul");
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
      // Bind the file to the right-click options
      rightClickMenu.file = elementType.file;

      rightClickFileActions.forEach(option => {
        menuList.appendChild(el("li", option));
      });
    } else {
      // element has no associated File
      // Remove the current file from the right click options if there is one
      rightClickMenu.file = null;
    }

    // Place the right click options with a slight adjustment
    const rightClickMenuOffset = 2; // pixels
    rightClickMenu.style.top = `${y - rightClickMenuOffset}px`;
    rightClickMenu.style.left = `${x - rightClickMenuOffset}px`;
    rightClickMenu.style.display = "block";
  }
}

function deleteRightClickOptions(optionsToDelete: string[]) {
  const rightClickMenu = <IFileElement>document.querySelector(".right-click-menu");
  const menuList = <HTMLElement>rightClickMenu.querySelector("ul");

  Array.from(menuList.querySelectorAll("li")).forEach(li => {
    if (optionsToDelete.includes(li.innerText)) {
      li.remove();
    }
  });
}
