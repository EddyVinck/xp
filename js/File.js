import imageUrls from "../img/*.*";

const wallpaperGrid = document.querySelector(".wallpaper-grid");

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

    this.associatedDesktopElement = null;

    this.createNecessaryElements();

    this.remove = this.remove.bind(this);
  }

  createNecessaryElements() {
    // create the file on the desktop or folder
    this.associatedDesktopElement = createDesktopElement(this.name, this.type);

    this.parentFolder.appendChild(this.associatedDesktopElement);

    // create the taskbar element
    // create the opened window
  }

  remove() {
    this.parentFolder.removeChild(this.associatedDesktopElement);
  }
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

export default File;
