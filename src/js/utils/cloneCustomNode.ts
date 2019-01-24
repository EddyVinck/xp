/** Fixes the no index signature error caused by clone[key] = element[key] 
 and the no implicit any rule */
interface IHTMLElement extends HTMLElement {
  [key: string]: any;
}

/** Diffs all custom properties on element and puts them on the returned clone */
function cloneCustomNode(element: IHTMLElement): IHTMLElement {
  const clone = <IHTMLElement>element.cloneNode(true);

  // compare the objects properties
  const originalKeys: string[] = Object.keys(element);
  const differentKeys = originalKeys.filter((key) => {
    return clone.hasOwnProperty(key) === false;
  });

  differentKeys.forEach((key) => {
    if (key === 'file') {
      clone[key] = element[key];
    }
  });

  return clone;
}

export default cloneCustomNode;
