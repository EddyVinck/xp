import imageUrls from "../img/*.*";
import { el, mount } from "redom";

const wallpaperGrid = document.querySelector(".wallpaper-grid");
const taskbar = document.querySelector("ul.taskbar");

class File {
  constructor({
    name = "Unnamed",
    type = "folder",
    parentFolder = wallpaperGrid,
    innerFolders = [],
    innerFiles = []
  } = {}) {
    this.name = name;
    this.type = type;
    this.parentFolder = parentFolder;
    this.innerFolders = innerFolders;
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
    this.openWindow = this.openWindow.bind(this);
    this.closeWindow = this.closeWindow.bind(this);
    this.createNecessaryElements = this.createNecessaryElements.bind(this);
    this.handleDesktopSingleClick = this.handleDesktopSingleClick.bind(this);
    this.handleDesktopDoubleClick = this.handleDesktopDoubleClick.bind(this);
    this.handleTaskbarClick = this.handleTaskbarClick.bind(this);

    // Setup functions
    this.createNecessaryElements();
  }

  // Creates desktop file, taskbar item
  // Adds necessary event listeners
  createNecessaryElements() {
    // Create the file on the desktop or folder
    this.desktopElement = createDesktopElement(this.name, this.type);
    this.parentFolder.appendChild(this.desktopElement);
    this.desktopElement.addEventListener("click", this.handleDesktopSingleClick);
    this.desktopElement.addEventListener("dblclick", this.handleDesktopDoubleClick);

    // create the opened window
  }

  remove() {
    this.taskbarElement.removeEventListener(this.handleTaskbarClick);
    this.desktopElement.removeEventListener(this.handleDesktopSingleClick);
    this.parentFolder.removeChild(this.desktopElement);
  }

  handleTaskbarClick(e) {
    console.log("taskbar click", this);
    const { isOpen } = this.state;

    if (isOpen) {
      // minify it
    } else {
      // open the window
      this.openWindow();
    }

    this.state.isOpen = !isOpen;
  }

  handleDesktopSingleClick(e) {}

  handleDesktopDoubleClick(e) {
    if (this.taskbarElement instanceof HTMLElement) {
      // taskbarElement already created
      // no need to do that again
    } else {
      this.openInital();
    }
    this.openWindow();
  }

  // Opens a file that is currently not opened
  // create the taskbar element
  // and open the window
  openInital() {
    // Create taskbarElement
    const taskbarElement = createTaskbarElement(this.desktopElement.cloneNode(true));
    this.taskbarElement = taskbarElement;
    taskbar.appendChild(taskbarElement);
    this.taskbarElement.addEventListener("click", this.handleTaskbarClick);
  }

  // Open the file's window
  openWindow() {
    console.log("opening window element...");
    let windowElement = null;

    if (this.windowElement instanceof HTMLElement) {
      // windowElement was already created
      windowElement = this.windowElement;
    } else {
      // windowElement did not exist yet
      windowElement = createWindowElement(this.name, this.type);
      this.windowElement = windowElement;
      console.log(this.windowElement);
      this.windowElement.querySelector(".close").addEventListener("click", this.closeWindow);
    }
    document.body.appendChild(windowElement);
  }

  closeWindow() {
    this.windowElement.parentNode.removeChild(this.windowElement);
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
  img.src = getFileIconUrl(fileType);
  img.alt = fileType;

  const cellName = document.createElement("span");
  cellName.classList.add("cell-name");
  cellName.innerText = fileName;

  desktopElement.appendChild(img);
  desktopElement.appendChild(cellName);

  return desktopElement;
}

function getFileIconUrl(fileIconName) {
  let fileIconUrl = "";
  switch (fileIconName) {
    case "folder":
      fileIconUrl += Object.values(imageUrls["folder-empty"])[0];
      break;
    case "control-panel":
      fileIconUrl += Object.values(imageUrls["control-panel"])[0];
      break;
    default:
      fileIconUrl += Object.values(imageUrls["folder-empty"])[0];
      break;
  }

  return fileIconUrl;
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
        el(".folder-label", el("img", { src: getFileIconUrl(fileType), alt: fileName }), el("span", fileName)),
        el(
          ".top-bar-controls",
          el(".top-bar-button.minimze"),
          el(".top-bar-button.maximize"),
          el(".top-bar-button.close")
        )
      ),
      el(
        ".menu-bar",
        el(".menu-top"),
        el(".menu-bottom"),
        el(
          ".address-bar",
          el("span", "Address"),
          el(
            ".address-input-wrapper",
            el(
              ".address-input-icon",
              el("img", { src: getFileIconUrl(fileType), alt: fileType }),
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
