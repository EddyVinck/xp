function getParentWithClass(child: HTMLElement, className: string) {
  let node: HTMLElement = child;
  while (node != null) {
    if (node.classList && node.classList.contains(className)) {
      return node;
    }
    node = node.parentNode;
  }
  return null;
}

export default getParentWithClass;
