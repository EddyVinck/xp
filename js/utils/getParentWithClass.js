function getParentWithClass(child, className) {
  let node = child;
  while (node != null) {
    if (node.classList && node.classList.contains(className)) {
      return node;
    }
    node = node.parentNode;
  }
  return null;
}

export default getParentWithClass;
