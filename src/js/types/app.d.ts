import File from '../File';

export interface IFileState {
  isActive: boolean;
  isMaximized: boolean;
  isOpen: boolean;
  position: {
    x: number;
    y: number;
  };
}

/** HTMLElement with an optional file: File property */
export interface IFileElement extends HTMLElement {
  file?: File;
}
