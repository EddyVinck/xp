import { el } from "redom";
import interact from "interactjs";

import { IFileState, IFileElement } from "./types/app";
import getIconUrl from "./utils/getIconUrl";
import cloneCustomNode from "./utils/cloneCustomNode";

const wallpaperGrid = document.querySelector(".wallpaper-grid");
const taskbar = document.querySelector("ul.taskbar");

let taskbarHeight: string = "";
if (taskbar instanceof HTMLElement) {
  taskbarHeight = `${taskbar.clientHeight}px`;
}

class File {
  private name: string;
  private type: string;
  private parentElement?: HTMLElement;
  private desktopElement: IFileElement;
  private taskbarElement?: IFileElement;
  private windowElement?: HTMLElement;
  private state: IFileState;
  private innerFiles?: File[];

  constructor({
    name = "Unnamed",
    type = "folder",
    parentElement = wallpaperGrid,
    innerFiles = []
  } = {}) {
    this.name = name;
    this.type = type;
    this.innerFiles = innerFiles;

    if (parentElement instanceof HTMLElement) {
      this.parentElement = parentElement;
    }

    this.state = {
      isOpen: false,
      isMaximized: false,
      isActive: false,
      position: {
        x: 0,
        y: 0
      }
    };

    // Function binding
    this.delete = this.delete.bind(this);
    this.showWindow = this.showWindow.bind(this);
    this.setActive = this.setActive.bind(this);
    this.dispatchActiveWindowChange = this.dispatchActiveWindowChange.bind(this);
    this.changeActiveAppearance = this.changeActiveAppearance.bind(this);
    this.showTaskbarCell = this.showTaskbarCell.bind(this);
    this.closeWindow = this.closeWindow.bind(this);
    this.toggleMaximize = this.toggleMaximize.bind(this);
    this.toggleMinimize = this.toggleMinimize.bind(this);
    this.handleDesktopSingleClick = this.handleDesktopSingleClick.bind(this);
    this.handleDesktopDoubleClick = this.handleDesktopDoubleClick.bind(this);
    this.handleWindowSingleClick = this.handleWindowSingleClick.bind(this);
    this.handleTaskbarClick = this.handleTaskbarClick.bind(this);
    this.handleDrag = this.handleDrag.bind(this);
    this.handleResize = this.handleResize.bind(this);

    // Add the File to the ParentElement in the DOM
    this.desktopElement = createDesktopElement(this.name, this.type);
    this.desktopElement.addEventListener("click", this.handleDesktopSingleClick);
    this.desktopElement.file = this;
    this.desktopElement.addEventListener("dblclick", this.handleDesktopDoubleClick);
    if (this.parentElement instanceof HTMLElement) {
      this.parentElement.appendChild(this.desktopElement);
    }
  }

  delete() {
    // When a user deletes a file or folder
    // remove all eventlisteners and elements
  }

  handleTaskbarClick() {
    this.toggleMinimize();
  }

  handleWindowSingleClick(e: Event) {
    const { isActive } = this.state;

    const didClickMinimizeOrClose =
      (<HTMLElement>e.target).classList.contains("minimize") ||
      (<HTMLElement>e.target).classList.contains("close");

    if (isActive === false && didClickMinimizeOrClose === false) {
      this.dispatchActiveWindowChange(true);
      this.setActive(true);
    }
  }

  handleDesktopSingleClick() {}

  handleDesktopDoubleClick() {
    const { isOpen } = this.state;
    this.state.isOpen = !isOpen;

    this.showTaskbarCell();
    this.showWindow();
  }

  // Open the file's window
  showWindow() {
    let windowElement = null;

    if (this.windowElement instanceof HTMLElement) {
      // windowElement was already created
      windowElement = this.windowElement;
    } else {
      // windowElement did not exist yet
      windowElement = createWindowElement(this.name, this.type);
      this.windowElement = windowElement;
      this.windowElement.addEventListener("click", this.handleWindowSingleClick);

      const close = this.windowElement.querySelector(".close");
      close && close.addEventListener("click", this.closeWindow);

      const maximize = this.windowElement.querySelector(".maximize");
      maximize && maximize.addEventListener("click", this.toggleMaximize);

      const minimize = this.windowElement.querySelector(".minimize");
      minimize && minimize.addEventListener("click", () => this.toggleMinimize(true));

      const topBar = this.windowElement.querySelector(".top-bar");
      interact(topBar).draggable(<any>{
        ignoreFrom: ".minimize, .maximize, .close",
        onmove: this.handleDrag
      });

      interact(this.windowElement)
        .resizable(<any>{
          // resize from all edges and corners
          edges: { left: true, right: true, bottom: true, top: true },

          // minimum size
          restrictSize: {
            min: { width: 300, height: 200 }
          }
        })
        .on("resizemove", this.handleResize);
    }
    document.body.appendChild(windowElement);
    this.dispatchActiveWindowChange(true);
    this.setActive(true);
  }

  handleDrag(event: IInteractPointerEvent) {
    // Only drag when the window is not maximized because this can cause
    // the window to move outside of the viewport completely.
    if (this.state.isMaximized === false) {
      // keep the dragged position in state
      const x = (this.state.position.x || 0) + event.dx;
      const y = (this.state.position.y || 0) + event.dy;

      // translate the element
      this.moveWindow(x, y);

      // update the posiion state
      this.state.position = {
        x,
        y
      };
    }
  }

  handleResize(event: IInteractPointerEvent) {
    if (this.state.isMaximized === false) {
      const target = event.target;
      let x = this.state.position.x || 0;
      let y = this.state.position.y || 0;

      // update the element's style
      if (target) {
        target.style.width = event.rect.width + "px";
        target.style.height = event.rect.height + "px";
      }

      // translate when resizing from top or left edges
      x += event.deltaRect.left;
      y += event.deltaRect.top;

      this.moveWindow(x, y);

      // update the posiion state
      this.state.position = {
        x,
        y
      };
    }
  }

  moveWindow(x: number, y: number) {
    if (this.windowElement) {
      this.windowElement.style.transform = `translate(${x}px, ${y}px)`;
    }
  }

  // Put the file in the taskbar
  showTaskbarCell() {
    let taskbarElement: IFileElement;

    if (this.taskbarElement instanceof HTMLElement) {
      taskbarElement = this.taskbarElement;
    } else {
      // Create the taskbar element because it didnt exist
      const desktopElement: IFileElement = cloneCustomNode(this.desktopElement);
      taskbarElement = createTaskbarElement(desktopElement);
      this.taskbarElement = taskbarElement;
      this.taskbarElement.addEventListener("click", this.handleTaskbarClick);
    }

    if (taskbar instanceof HTMLElement) {
      taskbar.appendChild(taskbarElement);
    }
  }

  closeWindow() {
    this.state.isOpen = false;

    if (this.windowElement && this.taskbarElement) {
      this.windowElement.remove();
      this.taskbarElement.remove();
    }
  }

  toggleMaximize() {
    const { isMaximized, position } = this.state;

    if (this.windowElement) {
      if (isMaximized) {
        // unmaximize
        this.windowElement.style.top = "";
        this.windowElement.style.left = "";
        this.windowElement.style.width = "";
        this.windowElement.style.height = "";
        this.moveWindow(position.x, position.y);
      } else {
        // Remove the positioning
        this.windowElement.style.transform = "";
        this.windowElement.style.top = "0px";
        this.windowElement.style.left = "0px";

        // Maximize the window element
        this.windowElement.style.width = "100%";
        this.windowElement.style.height = `calc(100vh - ${taskbarHeight})`;
      }
    }

    this.state.isMaximized = !isMaximized;
  }

  toggleMinimize(forceMinimize?: boolean): void {
    if (this.windowElement && this.parentElement) {
      const isCurrentlyMinimized = !document.body.contains(this.windowElement);
      const { isActive } = this.state;

      if ((isActive && isCurrentlyMinimized === false) || forceMinimize) {
        // minimize it
        this.setActive(false);
        this.windowElement.remove();
      } else {
        // unminimize
        this.parentElement.appendChild(this.windowElement);
        this.dispatchActiveWindowChange(true);
        this.setActive(true);
      }
    }
  }

  // http://javascript.info/dispatch-events#custom-events
  dispatchActiveWindowChange(isActive = false) {
    if (this.windowElement) {
      this.windowElement.dispatchEvent(
        new CustomEvent("change-active-window", {
          bubbles: true,
          detail: { newActive: isActive ? this : null }
        })
      );
    }
  }

  setActive(isActive = false) {
    this.state.isActive = isActive;
    this.changeActiveAppearance(isActive);
  }

  changeActiveAppearance(isActive = false) {
    // check if the windowElement has been created
    // otherwise this will error
    if (this.windowElement && this.taskbarElement) {
      if (isActive) {
        this.windowElement.classList.add("active");
        this.taskbarElement.classList.add("active");
      } else {
        this.windowElement.classList.remove("active");
        this.taskbarElement.classList.remove("active");
      }
    }
  }
}

function createTaskbarElement(desktopElement: IFileElement) {
  const li: IFileElement = document.createElement("li");
  li.appendChild(desktopElement);
  return li;
}

/** Returns a desktop cell element
  <div class="cell">

    <img src="img/folder_empty-3.png" alt="">

    <span class="cell-name">
      Projects
    </span>
    
  </div>
*/
function createDesktopElement(fileName: string, fileType: string): IFileElement {
  const desktopElement: IFileElement = document.createElement("div");
  desktopElement.classList.add("cell");

  const img = document.createElement("img");
  img.src = getIconUrl(fileType);
  img.alt = fileType;

  const cellName = document.createElement("span");
  cellName.classList.add("cell-name");
  cellName.innerText = fileName;

  desktopElement.appendChild(img);
  desktopElement.appendChild(cellName);

  return desktopElement;
}

// Creates and returns the window HTML element
function createWindowElement(fileName: string, fileType: string): HTMLElement {
  const windowElement: HTMLElement = el(
    ".folder-window",
    el(
      ".folder-header",
      el(
        ".top-bar",
        el(
          ".folder-label",
          el("img", { src: getIconUrl(fileType), alt: fileName }),
          el("span", fileName)
        ),
        el(
          ".top-bar-controls",
          el(".top-bar-button.minimize"),
          el(".top-bar-button.maximize"),
          el(".top-bar-button.close")
        )
      ),
      el(
        ".menu-bar",
        el(".menu-top"),
        el(
          ".menu-bottom",
          el(
            "ul",
            el(
              "li",
              el("img", { src: getIconUrl("arrow-back"), alt: "back icon" }),
              el("span", "Back")
            ),
            el("li", el("img", { src: getIconUrl("arrow-next"), alt: "next icon" }))
          ),
          el(
            "ul",
            el(
              "li",
              el("img", { src: getIconUrl("search"), alt: "Search icon" }),
              el("span", "Search")
            )
          )
        ),
        el(
          ".address-bar",
          el("span", "Address"),
          el(
            ".address-input-wrapper",
            el(
              ".address-input-icon",
              el("img", { src: getIconUrl(fileType), alt: fileType }),
              el("input.address-input", {
                type: "text",
                value: "C:\\Desktop\\Folder Name",
                placeholder: "C:\\Desktop\\Folder Name"
              })
            )
          )
        )
      )
    ),
    el(".folder-content", el(".file-grid"))
  );

  return windowElement;
}

export default File;
