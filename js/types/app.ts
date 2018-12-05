import File from "../File";

export interface FileState {
  isActive: boolean;
  isMaximized: boolean;
  isOpen: boolean;
  position: {
    x: number;
    y: number;
  };
}

/** HTMLElement with an optional file: File property */
export interface FileElement extends HTMLElement {
  file?: File;
}
