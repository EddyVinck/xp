const rightClickMenu = document.querySelector(".right-click-menu");

document.addEventListener(
  "contextmenu",
  e => {
    e.preventDefault();
    const { pageX: x, pageY: y } = e;
    handleRightClick(x, y);
  },
  false
);

document.addEventListener("click", e => {
  if (isClickingRightClickMenu(e.target, rightClickMenu)) {
    // handle any of the right click options if those are clicked
  } else {
    rightClickMenu.style.display = "none";
  }
});

function isClickingRightClickMenu(child, parent) {
  var node = child.parentNode;
  while (node != null) {
    if (node == parent) {
      return true;
    }
    node = node.parentNode;
  }
  return false;
}

function handleRightClick(x, y) {
  const rightClickMenu = document.querySelector(".right-click-menu");

  rightClickMenu.style.top = `${y}px`;
  rightClickMenu.style.left = `${x}px`;
  rightClickMenu.style.display = "block";
}
