import { IFileElement } from "../types/app";

/** Diffs all custom properties on element and puts them on the returned clone */
function cloneCustomNode(element: HTMLElement | IFileElement): HTMLElement | IFileElement {
  const clone = element.cloneNode(true);

  // compare the objects properties
  const originalKeys: string[] = Object.keys(element);
  const differentKeys = originalKeys.filter(key => {
    return clone.hasOwnProperty(key) === false;
  });

  differentKeys.forEach(key => {
    if (key === "file") {
      clone[key] = element[key];
    }
  });

  return <IFileElement>clone;
}

export default cloneCustomNode;
