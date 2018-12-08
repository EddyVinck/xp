interface IInteractPointerEvent extends PointerEvent {
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
