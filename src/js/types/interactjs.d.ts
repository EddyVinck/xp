import { InteractEvent } from 'interactjs';

export interface IInteractEvent extends InteractEvent {
  dx: number;
  dy: number;
  target: HTMLElement;
  rect: {
    width: string;
    height: string;
  };
  deltaRect: {
    left: number;
    top: number;
  };
}

export interface IDraggableOptions extends interact.DraggableOptions {
  ignoreFrom: string;
}

export interface IResizableOptions extends interact.ResizableOptions {
  restrictSize: {
    min: {
      width: number;
      height: number;
    };
  };
}
