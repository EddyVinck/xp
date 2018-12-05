import { FileElement } from "../types/app";

/** Diffs all custom properties on element and puts them on the returned clone */
function cloneCustomNode(element: HTMLElement | FileElement): HTMLElement | FileElement {
  const clone = element.cloneNode(true);

  // compare the objects properties
  const originalKeys = Object.keys(element);
  const differentKeys = originalKeys.map(key => {
    if (clone.hasOwnProperty(key) === false) {
      return key;
    }
  });

  differentKeys.forEach(key => {
    clone[key] = element[key];
  });

  return <HTMLElement>clone;
}

export default cloneCustomNode;
