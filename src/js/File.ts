import { el } from 'redom';
import interact, { InteractEvent, Listener } from 'interactjs';

import { IFileState, IFileElement, FileOptions } from './types/app';
import { createTaskbarElement, createDesktopElement, createWindowElement } from './createElement';
import cloneCustomNode from './utils/cloneCustomNode';
import { IInteractEvent, IDraggableOptions } from './types/interactjs';
import { IResizableOptions } from './types/interactjs.d';

const wallpaperGrid = document.querySelector('.wallpaper-grid') as HTMLElement;
const taskbar = document.querySelector('ul.taskbar');

let taskbarHeight = '';
if (taskbar instanceof HTMLElement) {
  taskbarHeight = `${taskbar.clientHeight}px`;
}

class File {
  private _name: string;
  public _type: string; // 'folder' | '...'
  private parentElement: HTMLElement;
  private desktopElement: IFileElement;
  private taskbarElement?: IFileElement;
  public windowElement: IFileElement;
  public state: IFileState;
  private _innerFiles: File[];
  private _innerFilesContainer: HTMLElement;
  private parentFile?: File;

  constructor({
    name = 'Unnamed',
    type = 'folder',
    parentFile = undefined,
    innerFiles = [],
  }: FileOptions = {}) {
    this._name = name;
    this._type = type;
    this._innerFiles = innerFiles;
    this.parentFile = parentFile;

    if (this.parentFile !== undefined) {
      this.parentElement = (this.parentFile as File).innerFileGrid || wallpaperGrid;
    } else {
      this.parentElement = wallpaperGrid;
    }

    this.state = {
      isOpen: false,
      isMaximized: false,
      isActive: false,
      position: {
        x: 0,
        y: 0,
      },
    };

    // Function binding
    this.delete = this.delete.bind(this);
    this.showWindow = this.showWindow.bind(this);
    this.createInteractableWindowElement = this.createInteractableWindowElement.bind(this);
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
    this.handleRename = this.handleRename.bind(this);
    this.handleDrag = this.handleDrag.bind(this);
    this.handleResize = this.handleResize.bind(this);

    // Add the File to the ParentElement in the DOM
    this.desktopElement = createDesktopElement(this._name, this._type);
    this.desktopElement.addEventListener('click', this.handleDesktopSingleClick);
    this.desktopElement.file = this;
    this.desktopElement.addEventListener('dblclick', this.handleDesktopDoubleClick);

    if (this.parentElement && this.parentElement instanceof HTMLElement) {
      this.parentElement.appendChild(this.desktopElement);
    }

    this.windowElement = this.createInteractableWindowElement(createWindowElement);
    this.windowElement.file = this;
    this.taskbarElement = this.createInteractableTaskbarElement();

    // check if if (this._type === "folder") when seperating File and Folder classes
    this._innerFilesContainer = this.windowElement.querySelector('.file-grid') as HTMLElement;
    this.getInnerFilesContainer = this.getInnerFilesContainer.bind(this);
  }

  public get name(): string {
    return this._name;
  }
  public get type(): string {
    return this._type;
  }
  public get innerFileGrid(): HTMLElement | null {
    return this.windowElement.querySelector('.file-grid');
  }

  public innerFiles = {
    _self: this,
    _innerFilesContainer: this.getInnerFilesContainer(),

    push(childFile: File) {
      // push a child file and change the parentElement
      childFile.parentFile = this._self;
      childFile.parentElement = this._self._innerFilesContainer;
      this._self._innerFiles.push(childFile);

      // Append the file to a different DOM node
      this._self._innerFilesContainer.appendChild(childFile.desktopElement);
    },
  };

  public debug(): void {
    console.log(this);
  }

  private getInnerFilesContainer(): HTMLElement {
    return this._innerFilesContainer;
  }

  /**
   * @todo Move to recycle bin on deletion
   */
  public delete(): void {
    // When a user deletes a file or folder
    // remove all eventlisteners and elements
    this.closeWindow();
    this.desktopElement.remove();
  }

  public rename(): void {
    const cellNameElement = this.desktopElement.querySelector('.cell-name') as HTMLElement;
    const previousName = cellNameElement.textContent;

    // turn the cell-name span in an input
    cellNameElement.remove();
    const nameInput = el('input.cell-name', {
      value: previousName,
    });
    this.desktopElement.appendChild(nameInput);
    nameInput.focus();

    // on submit change the name
    nameInput.addEventListener('keyup', (e: KeyboardEvent) => {
      if (e.keyCode === 13) {
        const inputElement = e.target as HTMLInputElement;

        const newName = inputElement.value;
        this.handleRename(newName, cellNameElement);

        // remove event listener implicitly by removing the element and all references
        try {
          nameInput.remove();
        } catch (error) {
          // nameInput was already removed by blur event
        }
      }
    });

    const handleUnfocus = (): void => {
      if (document.body.contains(nameInput)) {
        this.desktopElement.appendChild(cellNameElement);

        // remove event listener implicitly by removing the element and all references
        nameInput.remove();
      }
    };

    // blur is called when the name input is unfocused
    nameInput.addEventListener('blur', handleUnfocus);
  }

  private handleRename(newName: string, cellNameElement: HTMLElement): void {
    this._name = newName;
    cellNameElement.innerText = newName;
    this.desktopElement.appendChild(cellNameElement);

    // Check if the filename needs to be updated
    const windowElement = this.windowElement as HTMLElement;
    const currentFileNameSpan = windowElement.querySelector('.folder-label span') as HTMLElement;
    const currentFileName = currentFileNameSpan.innerText;

    if (currentFileName !== this._name) {
      const taskbarElement = this.taskbarElement as HTMLElement;
      const currentTaskbarFileNameSpan = taskbarElement.querySelector('.cell-name') as HTMLElement;

      currentFileNameSpan.innerText = this._name;
      currentTaskbarFileNameSpan.innerText = this._name;
    }
  }

  private handleTaskbarClick(): void {
    this.toggleMinimize();
  }

  private handleWindowSingleClick(e: Event): void {
    const { isActive } = this.state;

    const didClickMinimizeOrClose =
      (e.target as HTMLElement).classList.contains('minimize') ||
      (e.target as HTMLElement).classList.contains('close');

    if (isActive === false && didClickMinimizeOrClose === false) {
      this.dispatchActiveWindowChange(true);
      this.setActive(true);
    }
  }

  private handleDesktopSingleClick(): void {}

  private handleDesktopDoubleClick(): void {
    const { isOpen } = this.state;
    this.state.isOpen = !isOpen;

    this.showTaskbarCell();
    this.showWindow();
  }

  // Open the file's window
  // dispatch a active-window-change event to set all other files inactive
  public showWindow(callback = () => {}): void {
    let windowElement = this.windowElement;

    document.body.appendChild(windowElement);
    this.dispatchActiveWindowChange(true);

    // Handle window element replacement e.g. when opening a folder in a folder
    // Check if the File has a parent File object.
    if (this.parentFile !== undefined) {
      console.log(`${this.name} was opened from ${this.parentFile.name}`);

      // Files of the same type (like nested folders) should not open a new window
      if (this._type === this.parentFile._type) {
        // check the size etc. of the parent file
        const { height, width, transform } = this.parentFile.windowElement.style;
        const { x, y } = this.parentFile.state.position;

        // Copy the parent's position state for InteractJS
        this.state.position = { x, y };

        // apply the size etc. to the child file
        Object.assign(this.windowElement.style, { height, width, transform });

        // close the parent file
        this.parentFile.closeWindow();
      } else {
        console.log(`They were not the same type.`);
        // open new window
      }
    }

    this.setActive(true);
    callback();
  }

  public createInteractableWindowElement(
    windowElementCreator: (name: string, type: string) => HTMLElement
  ): HTMLElement {
    // windowElement did not exist yet
    const windowElement = windowElementCreator(this._name, this._type);
    this.windowElement = windowElement;
    this.windowElement.addEventListener('click', this.handleWindowSingleClick);

    const close = this.windowElement.querySelector('.close');
    close && close.addEventListener('click', this.closeWindow);

    const maximize = this.windowElement.querySelector('.maximize');
    maximize && maximize.addEventListener('click', this.toggleMaximize);

    const minimize = this.windowElement.querySelector('.minimize');
    minimize && minimize.addEventListener('click', () => this.toggleMinimize(true));

    const topBar = this.windowElement.querySelector('.top-bar');

    const draggableOptions: IDraggableOptions = {
      ignoreFrom: '.minimize, .maximize, .close',
      onmove: this.handleDrag,
    };

    const resizableOptions: IResizableOptions = {
      // resize from all edges and corners
      edges: { left: true, right: true, bottom: true, top: true },

      // minimum size
      restrictSize: {
        min: { width: 300, height: 200 },
      },
    };

    interact(topBar)
      .draggable(draggableOptions)
      .on('dragstart', () => {
        this.dispatchActiveWindowChange(true);
        this.setActive(true);
      });

    interact(this.windowElement)
      .resizable(resizableOptions)
      .on('resizemove', this.handleResize as Listener);

    return windowElement;
  }

  private handleDrag(event: InteractEvent): void {
    // Only drag when the window is not maximized because this can cause
    // the window to move outside of the viewport completely.
    if (this.state.isMaximized === false) {
      // keep the dragged position in state
      const x = (this.state.position.x || 0) + event.dx;
      const y = (this.state.position.y || 0) + event.dy;

      // translate the element
      this.moveWindow(x, y);

      // update the dragged posiion state
      this.state.position = {
        x,
        y,
      };
    }
  }

  private handleResize(event: IInteractEvent): void {
    if (this.state.isMaximized === false) {
      const target = event.target;
      let x = this.state.position.x || 0;
      let y = this.state.position.y || 0;

      // update the element's style
      if (target) {
        target.style.width = event.rect.width + 'px';
        target.style.height = event.rect.height + 'px';
      }

      // translate when resizing from top or left edges
      x += event.deltaRect.left;
      y += event.deltaRect.top;

      this.moveWindow(x, y);

      // update the dragged posiion state
      this.state.position = {
        x,
        y,
      };
    }
  }

  private moveWindow(x: number, y: number): void {
    if (this.windowElement) {
      this.windowElement.style.transform = `translate(${x}px, ${y}px)`;
    }
  }

  // Put the file in the taskbar
  private showTaskbarCell(): void {
    const taskbar = document.querySelector('ul.taskbar');
    const taskbarElement = this.taskbarElement as IFileElement;

    if (taskbar instanceof HTMLElement) {
      taskbar.appendChild(taskbarElement);
    }
  }

  private createInteractableTaskbarElement(): IFileElement {
    // Create the taskbar element because it didnt exist
    const desktopElement: IFileElement = cloneCustomNode(this.desktopElement);
    const taskbarElement = createTaskbarElement(desktopElement);
    taskbarElement.addEventListener('click', this.handleTaskbarClick);

    return taskbarElement;
  }

  public closeWindow(): void {
    this.state.isOpen = false;

    if (this.windowElement && this.taskbarElement) {
      this.windowElement.remove();
      this.taskbarElement.remove();
    }
  }

  public toggleMaximize(): void {
    const { isMaximized, position } = this.state;

    if (this.windowElement) {
      if (isMaximized) {
        // unmaximize
        this.windowElement.style.top = '';
        this.windowElement.style.left = '';
        this.windowElement.style.width = '';
        this.windowElement.style.height = '';
        this.moveWindow(position.x, position.y);
      } else {
        // Remove the positioning
        this.windowElement.style.transform = '';
        this.windowElement.style.top = '0px';
        this.windowElement.style.left = '0px';

        // Maximize the window element
        this.windowElement.style.width = '100%';
        this.windowElement.style.height = `calc(100vh - ${taskbarHeight})`;
      }
    }

    this.state.isMaximized = !isMaximized;
  }

  private toggleMinimize(forceMinimize?: boolean): void {
    if (this.windowElement && this.parentElement) {
      const isCurrentlyMinimized = !document.body.contains(this.windowElement);
      const { isActive } = this.state;

      if ((isActive && isCurrentlyMinimized === false) || forceMinimize) {
        // minimize it
        this.setActive(false);
        this.windowElement.remove();
      } else {
        // unminimize
        document.body.appendChild(this.windowElement);
        this.dispatchActiveWindowChange(true);
        this.setActive(true);
      }
    }
  }

  // http://javascript.info/dispatch-events#custom-events
  private dispatchActiveWindowChange(isActive = false): void {
    if (this.windowElement) {
      this.windowElement.dispatchEvent(
        new CustomEvent('change-active-window', {
          bubbles: true,
          detail: { newActive: isActive ? this : null },
        })
      );
    }
  }

  public setActive(isActive = false): void {
    this.state.isActive = isActive;
    this.changeActiveAppearance(isActive);
  }

  private changeActiveAppearance(isActive = false): void {
    // check if the windowElement has been created
    // otherwise this will error
    if (this.windowElement && this.taskbarElement) {
      if (isActive) {
        this.windowElement.classList.add('active');
        this.taskbarElement.classList.add('active');
      } else {
        this.windowElement.classList.remove('active');
        this.taskbarElement.classList.remove('active');
      }
    }
  }
}

export default File;
