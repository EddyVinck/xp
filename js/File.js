import imageUrls from "../img/*.*";

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
      windowElement = createWindowElement(this.fileName, this.fileType);
      this.windowElement = windowElement;
    }
    document.body.appendChild(windowElement);

    setTimeout(this.closeWindow, 2000);
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
  // Root
  const fileWindow = document.createElement("div");
  fileWindow.classList.add("folder-window");

  // Window -> Header
  const header = document.createElement("div");
  header.classList.add("folder-header");
  fileWindow.appendChild(header);

  // Header -> Top Bar
  const topBar = document.createElement("div");
  topBar.classList.add("top-bar");
  header.appendChild(topBar);

  // Top Bar -> Folder Label
  const folderLabel = document.createElement("div");
  folderLabel.classList.add("folder-label");
  topBar.appendChild(folderLabel);

  // Folder Label -> img
  const folderLabelImage = document.createElement("img");
  folderLabelImage.src = getFileIconUrl(fileType);
  folderLabelImage.alt = fileType;
  folderLabel.appendChild(folderLabelImage);

  // Folder Label -> span
  const folderLabelSpan = document.createElement("img");
  folderLabelSpan.innerText = fileName;
  folderLabel.appendChild(folderLabelSpan);

  // Top Bar -> Top Bar Controls
  const topBarControls = document.createElement("div");
  topBarControls.classList.add("top-bar-controls");
  topBar.appendChild(topBarControls);

  // Top Bar Controls -> Minimize
  const minimizeButton = document.createElement("div");
  minimizeButton.classList.add("top-bar-button", "minimize");
  topBarControls.appendChild(minimizeButton);

  // Top Bar Controls -> Maximize
  const maximizeButton = document.createElement("div");
  maximizeButton.classList.add("top-bar-button", "maximize");
  topBarControls.appendChild(maximizeButton);

  // Top Bar Controls -> Close
  const closeButton = document.createElement("div");
  closeButton.classList.add("top-bar-button", "close");
  topBarControls.appendChild(closeButton);

  // Header -> Menu Bar
  const menuBar = document.createElement("div");
  menuBar.classList.add("menu-bar");
  header.appendChild(menuBar);

  // Menu Bar -> Menu Top
  const menuTop = document.createElement("div");
  menuTop.classList.add("menu-top");
  menuBar.appendChild(menuTop);
  // ul
  //   li
  //     {Optionname}
  //     ul > li{sub-option}

  // Menu Bar -> Menu Bottom
  const menuBottom = document.createElement("div");
  menuBottom.classList.add("menu-bottom");
  menuBar.appendChild(menuBottom);
  // ul
  //   li
  //     img(src="img/xp-arrow-icon-previous.png")
  //     span{back}
  //   li
  //     img(src="img/xp-arrow-icon-next.png")
  // ul
  //   li{Search}

  // Menu Bar -> Address Bar
  const addressBar = document.createElement("div");
  addressBar.classList.add("address-bar");
  menuBar.appendChild(addressBar);

  // Address Bar -> span
  const addressBarSpan = document.createElement("span");
  addressBarSpan.innerText = "Address";
  addressBar.appendChild(addressBarSpan);

  // Address Bar -> .address-input-wrapper
  const addressInputWrapper = document.createElement("div");
  addressInputWrapper.classList.add("address-input-wrapper");
  addressBar.appendChild(addressInputWrapper);

  // .address-input-wrapper -> .address-input-icon
  const addressInputIcon = document.createElement("div");
  addressInputIcon.classList.add("address-input-icon");
  addressInputWrapper.appendChild(addressInputIcon);

  // .address-input-wrapper -> img
  const addressInputIconImage = document.createElement("img");
  addressInputIconImage.src = getFileIconUrl(fileType);
  addressInputIcon.appendChild(addressInputIconImage);

  // .address-input-wrapper -> input.address-input
  const addressInput = document.createElement("input");
  addressInput.classList.add("address-input");
  addressInput.type = "text";
  addressInput.value = "C:DesktopFolder Name";
  addressInput.placeholder = "C:DesktopFolder Name";
  addressInputWrapper.appendChild(addressInput);

  // Window -> Content
  const content = document.createElement("div");
  content.classList.add("folder-content");
  fileWindow.appendChild(content);

  const fileGrid = document.createElement("div");
  fileGrid.classList.add("file-grid");
  content.appendChild(fileGrid);

  return fileWindow;
}

export default File;
