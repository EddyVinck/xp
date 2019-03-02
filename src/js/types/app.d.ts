import File from '../File';

export interface IFileState {
  isActive: boolean;
  isMaximized: boolean;
  isOpen: boolean;
  position: {
    x: number;
    y: number;
  };
  previousButtonTarget: File | null;
  nextButtonTarget: File | null;
}

export interface FileOptions {
  name?: string;
  type?: string;
  parentFile?: File;
  innerFiles?: File[];
}

/** HTMLElement with an optional file: File property */
export interface IFileElement extends HTMLElement {
  file?: File;
}
