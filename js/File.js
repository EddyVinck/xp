import getIconUrl from "./utils/getIconUrl.js";
import { el, mount } from "redom";

const wallpaperGrid = document.querySelector(".wallpaper-grid");
const taskbar = document.querySelector("ul.taskbar");

class File {
  constructor({
    name = "Unnamed",
    type = "folder",
    parentElement = wallpaperGrid,
    innerFiles = []
  } = {}) {
    this.name = name;
    this.type = type;
    this.parentElement = parentElement;
    this.innerFiles = innerFiles;

    // A lovely collection of boolean flags (for now)
    // Maybe look into implementing a finite state machine
    this.state = {
      isOpen: false
    };

    // Associated DOM elements
    this.desktopElement = null;
    this.taskbarElement = null;
    this.windowElement = null;

    // Function binding
    this.remove = this.remove.bind(this);
    this.showWindow = this.showWindow.bind(this);
    this.showTaskbarCell = this.showTaskbarCell.bind(this);
    this.closeWindow = this.closeWindow.bind(this);
    this.addFileToParentElement = this.addFileToParentElement.bind(this);
    this.handleDesktopSingleClick = this.handleDesktopSingleClick.bind(this);
    this.handleDesktopDoubleClick = this.handleDesktopDoubleClick.bind(this);
    this.handleTaskbarClick = this.handleTaskbarClick.bind(this);

    this.addFileToParentElement();
  }

  // Creates desktop file, taskbar item
  // Adds necessary event listeners
  addFileToParentElement() {
    // Create the file on the desktop or folder
    this.desktopElement = createDesktopElement(this.name, this.type);
    this.parentElement.appendChild(this.desktopElement);
    this.desktopElement.addEventListener("click", this.handleDesktopSingleClick);
    this.desktopElement.addEventListener("dblclick", this.handleDesktopDoubleClick);
  }

  remove() {
    this.taskbarElement.removeEventListener(this.handleTaskbarClick);
    this.desktopElement.removeEventListener(this.handleDesktopSingleClick);
    this.parentElement.removeChild(this.desktopElement);
  }

  handleTaskbarClick(e) {
    console.log("taskbar click", this);
    const { isOpen } = this.state;
    console.log(`was this item already opened? ${isOpen}`);

    if (isOpen) {
      // minimize it
      console.log("minimizing...");
    } else {
      console.log("opening...");

      // open the window
      this.showWindow();
    }

    this.state.isOpen = !isOpen;
  }

  handleDesktopSingleClick(e) {}

  handleDesktopDoubleClick(e) {
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
      this.windowElement.querySelector(".close").addEventListener("click", this.closeWindow);
    }
    document.body.appendChild(windowElement);
  }

  // Put the file in the taskbar
  showTaskbarCell() {
    let taskbarElement = null;

    if (this.taskbarElement instanceof HTMLElement) {
      taskbarElement = this.taskbarElement;
    } else {
      // Create the taskbar element because it didnt exist
      taskbarElement = createTaskbarElement(this.desktopElement.cloneNode(true));
      this.taskbarElement = taskbarElement;
      this.taskbarElement.addEventListener("click", this.handleTaskbarClick);
    }
    taskbar.appendChild(taskbarElement);
  }

  closeWindow() {
    this.state.isOpen = false;

    this.windowElement.parentNode.removeChild(this.windowElement);
    this.taskbarElement.parentNode.removeChild(this.taskbarElement);
  }
}

function createTaskbarElement(desktopElement) {
  const li = document.createElement("li");
  li.appendChild(desktopElement);
  return li;
}

// Returns a desktop cell
/*
  <div class="cell">
    <img src="img/folder_empty-3.png" alt="">
    <span class="cell-name">
      Projects
    </span>
  </div>
*/
function createDesktopElement(fileName, fileType) {
  const desktopElement = document.createElement("div");
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
/*
.folder-window
  .folder-header
    .top-bar
      .folder-label
        img(src="img/folder-empty.png")
        span{folder-name}
      .top-bar-controls
        .top-bar-button.minimize
        .top-bar-button.maximize
        .top-bar-button.close
    .menu-bar
      .menu-top
        ul
          li
            {Optionname}
            ul > li{sub-option}
      .menu-bottom
        ul
          li
            img(src="img/xp-arrow-icon-previous.png")
            span{back}
          li
            img(src="img/xp-arrow-icon-next.png")
        ul
          li{Search}
      .address-bar
        span{Address}
        .address-input-wrapper
          .address-input-icon
            img(src="img/folder-empty.png")
          input.address-input(type="text" value="C:\Desktop\Folder Name" placeholder="C:\Desktop\Folder Name")  
  .folder-content
    .file-grid
      .cell
*/
function createWindowElement(fileName, fileType) {
  const windowElement = el(
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
