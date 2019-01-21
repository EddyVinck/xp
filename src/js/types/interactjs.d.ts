import { InteractEvent } from "interactjs";

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
