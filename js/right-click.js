import isChildElement from "./utils/isChildElement";

const rightClickMenu = document.querySelector(".right-click-menu");

// maybe do a pub sub or observable thing where you keep track of opened or active elements
// instead of putting listeners on every individual element
// that might get hard to maintain
const currentlyOpenedElements = [];
const currentlyActiveElements = [];

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
  if (isChildElement(e.target, rightClickMenu)) {
    // handle any of the right click options if those are clicked
  } else {
    rightClickMenu.style.display = "none";
  }
});

function handleRightClick(x, y) {
  const rightClickMenu = document.querySelector(".right-click-menu");

  rightClickMenu.style.top = `${y}px`;
  rightClickMenu.style.left = `${x}px`;
  rightClickMenu.style.display = "block";
}
