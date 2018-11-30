function parentHasClass(child, className) {
  let node = child;
  while (node != null) {
    if (node.classList && node.classList.contains(className)) {
      return true;
    }
    node = node.parentNode;
  }
  return false;
}

export default parentHasClass;
