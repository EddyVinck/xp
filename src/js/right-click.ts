import isChildElement from './utils/isChildElement';
import getParentWithClass from './utils/getParentWithClass';
import { IFileElement, FileOptions } from './types/app';
import { el } from 'redom';
import File from './File';
import allFiles from './app';

const rightClickMenu = document.querySelector('.right-click-menu') as IFileElement;
const iconActions = ['Debug', 'Delete', 'Rename'];
const gridActions = ['Debug', 'New folder'];

function getTargetTypeForRightClick(
  eventTarget: IFileElement
): { elementType: string; fileType: string } {
  let elementType = '';
  let fileType = '';

  // figure out if it is a file, a window or something else
  if (getParentWithClass(eventTarget, 'cell')) {
    // it's a file
    elementType = 'file';

    // check what kind of file
    const target = getParentWithClass(eventTarget, 'cell') as IFileElement;
    if (target.file) {
      fileType = target.file.type;
    }
  } else if (getParentWithClass(eventTarget, 'window')) {
    // it's a window
    elementType = 'window';

    // check what kind of window
    const target = getParentWithClass(eventTarget, 'window') as IFileElement;
    if (target.file) {
      fileType = target.file.type;
    }
  } else if (eventTarget.className.includes('wallpaper')) {
    // it's a wallpaper
    elementType = 'wallpaper';
  } else {
    // default to wallpaper
    elementType = 'wallpaper';
  }

  return { elementType, fileType };
}

/**
 * @description the function that makes the context menu show up.
 * It attaches a File instance to the context menu if there is one
 * @todo check if the user clicked inside a folder window
 */
function handleRightClick(e: MouseEvent): void {
  let rightClickActions: string[] = [];
  const rightClickMenu = document.querySelector('.right-click-menu') as IFileElement;
  const menuList = rightClickMenu.querySelector('ul') as HTMLElement;
  const { pageX: x, pageY: y } = e;

  if (e.target instanceof HTMLElement && rightClickMenu instanceof HTMLElement) {
    const { elementType, fileType } = getTargetTypeForRightClick(e.target);

    if (elementType === 'file') {
      if (fileType === 'folder') {
        rightClickActions = iconActions;
        rightClickMenu.file = (getParentWithClass(e.target, 'cell') as IFileElement).file;
      }
    } else if (elementType === 'window') {
      rightClickActions = gridActions;
      rightClickMenu.file = (getParentWithClass(e.target, 'window') as IFileElement).file;
    } else if (elementType === 'wallpaper') {
      delete rightClickMenu.file;
      rightClickActions = gridActions;
    }

    rightClickActions.forEach((option) => {
      menuList.appendChild(el('li', option));
    });

    // Place the right click options with a slight adjustment
    const rightClickMenuOffset = 2; // pixels
    rightClickMenu.style.top = `${y - rightClickMenuOffset}px`;
    rightClickMenu.style.left = `${x - rightClickMenuOffset}px`;
    rightClickMenu.style.display = 'block';
  }
}

/**
 * @todo update filename availability checking for nested folders
 */
function handleFolderCreation(parentFile?: File): void {
  let fileName = 'New folder';
  const allFileNames = allFiles.map((file) => file.name);

  if (allFileNames.includes(fileName) === true) {
    let fileIndex = 1;
    while (allFileNames.includes(fileName) === true) {
      fileName = `New folder (${fileIndex})`;
      fileIndex++;
    }
  }

  let fileOptions: FileOptions = { name: fileName, type: 'folder', parentFile: undefined };
  if (parentFile !== undefined) {
    fileOptions.parentFile = parentFile;
  }

  const newFile = new File(fileOptions);
  newFile.rename();
  allFiles.push(newFile);
}

function removeRightClickOptions(optionsToDelete: string[]): void {
  const rightClickMenu = document.querySelector('.right-click-menu') as IFileElement;
  const menuList = rightClickMenu.querySelector('ul') as HTMLElement;

  Array.from(menuList.querySelectorAll('li')).forEach((li) => {
    if (optionsToDelete.includes(li.innerText)) {
      li.remove();
    }
  });
}

document.addEventListener(
  'contextmenu',
  (e: MouseEvent) => {
    e.preventDefault();

    // cleanup
    removeRightClickOptions(iconActions);
    removeRightClickOptions(gridActions);

    handleRightClick(e);
  },
  false
);

document.addEventListener('click', (e: MouseEvent) => {
  if (isChildElement(e.target as HTMLElement, rightClickMenu)) {
    // handle any of the right click options if those are clicked

    if (e.target instanceof HTMLElement) {
      // get the file from the parent
      const file = rightClickMenu.file;
      const optionName = e.target.innerText.toLowerCase().replace(' ', '-');

      if (file) {
        // user has clicked on a file option
        switch (optionName) {
          case 'delete':
            file.delete();
            break;
          case 'rename':
            file.rename();
            break;
          case 'debug':
            file.debug();
            break;
          case 'new-folder':
            handleFolderCreation(file);
            break;
          default:
            break;
        }
      } else {
        // User has right-clicked on something else
        switch (optionName) {
          case 'new-folder':
            handleFolderCreation();
            break;
          case 'debug':
            console.log(allFiles);
            break;
          default:
            break;
        }
      }
    }
  }

  // close the right click menu
  rightClickMenu.style.display = 'none';
});
