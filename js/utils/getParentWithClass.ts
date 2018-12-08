/** Returns the first parent with a given classname or null */
function getParentWithClass(child: HTMLElement, className: string): HTMLElement | null {
  let node: HTMLElement = child;
  while (node != null) {
    if (node.classList && node.classList.contains(className)) {
      return node;
    }
    node = <HTMLElement>node.parentNode;
  }
  return null;
}

export default getParentWithClass;
